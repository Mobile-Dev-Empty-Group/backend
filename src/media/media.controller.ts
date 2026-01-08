import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { diskStorage } from 'multer';
import { extname, resolve, sep } from 'path';
import type { Response } from 'express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // Tên này phải khớp với FileInterceptor('file') bên dưới
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      // Cấu hình lưu trữ
      storage: diskStorage({
        destination: './uploads', // Lưu vào thư mục uploads ở root
        filename: (req, file, cb) => {
          // Tạo tên file ngẫu nhiên để tránh trùng
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      // Validate loại file (chỉ cho ảnh)
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not an image');
    }
    // Trả về đường dẫn file cho user
    return { url: file.path };
  }

  @Get()
  @ApiQuery({
    name: 'url',
    required: true,
    example: 'uploads\\818f42f67186c604450318778ab10c7e4.png',
  })
  async getMedia(
    @Query('url') url: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (!url || typeof url !== 'string') {
      throw new BadRequestException('Missing url');
    }

    const raw = url.trim();
    if (!raw) {
      throw new BadRequestException('Missing url');
    }

    // Normalize Windows-style paths from client (uploads\\file.png) to safe relative path.
    const normalized = raw.replace(/\\/g, '/').replace(/^\/+/, '');

    const uploadsRoot = resolve(process.cwd(), 'uploads');
    const target = normalized.startsWith('uploads/')
      ? resolve(process.cwd(), normalized)
      : resolve(uploadsRoot, normalized);

    // Prevent path traversal: target must stay inside uploadsRoot.
    const uploadsRootWithSep = uploadsRoot.endsWith(sep)
      ? uploadsRoot
      : uploadsRoot + sep;
    if (!(target === uploadsRoot || target.startsWith(uploadsRootWithSep))) {
      throw new BadRequestException('Invalid url');
    }

    try {
      const stats = await stat(target);
      if (!stats.isFile()) {
        throw new NotFoundException('File not found');
      }
    } catch {
      throw new NotFoundException('File not found');
    }

    // Set a basic content-type for common image extensions.
    const extension = extname(target).toLowerCase();
    const contentTypeByExt: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    res.setHeader(
      'Content-Type',
      contentTypeByExt[extension] ?? 'application/octet-stream',
    );

    return new StreamableFile(createReadStream(target));
  }
}
