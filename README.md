Cấu trúc thư mục

- /prisma: thư mục liên quan đến database. Chỉnh sửa file schema.prisma để thay đổi database
- /src: thư mục code chính. Mỗi model con gồm có service, controller, module. 1 thư mục có controller trong /src tương tứng với 1 sub url ở api. VD có file /src/task/controller.ts thì sẽ tự tạo api /task

Hướng dẫn chạy code

- npm i
- npx prisma generate: tạo prisma client ở thư mục /generate để các service sử dụng
- npx prisma studio: xem datatbase nhanh trên giao diện web
- npm run start:dev: chạy server

Hướng dẫn code:
Khi cần code 1 model mới, ví dụ task

- Tạo cấu trúc thư mục bằng các lệnh:
  - nest g module task
  - nest g service task
  - nest g controller task
- Viết logic xử lý, truy vấn database trong file task.service.ts. Import PrismaClient vào để truy vấn database
- Viết định nghĩa url api và gọi hàm service xử lý tương ứng trong file controller
