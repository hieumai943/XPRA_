#!/bin/bash

# Đường dẫn đến file .htpasswd
HTPASSWD_FILE="/etc/nginx/.htpasswd"

# Tạo username ngẫu nhiên (8 ký tự)
NEW_USERNAME=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

# Tạo mật khẩu ngẫu nhiên (12 ký tự)
NEW_PASSWORD=$(openssl rand -base64 12)

# Xóa file .htpasswd cũ (nếu có)
> $HTPASSWD_FILE

# Tạo tài khoản mới
htpasswd -b $HTPASSWD_FILE $NEW_USERNAME $NEW_PASSWORD

# Ghi log
echo "Auth credentials changed at $(date)" >> /var/log/auth_changes.log

# Tải lại cấu hình Nginx
nginx -s reload

# In ra thông tin đăng nhập mới
echo "New credentials:"
echo "Username: $NEW_USERNAME"
echo "Password: $NEW_PASSWORD"

# Lưu thông tin đăng nhập vào file (trong thực tế, bạn nên sử dụng phương pháp an toàn hơn)
echo "Username: $NEW_USERNAME" > /auth_credentials.txt
echo "Password: $NEW_PASSWORD" >> /auth_credentials.txt