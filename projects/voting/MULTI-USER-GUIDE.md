# Multi-User Voting System Guide

## Tổng quan
Hệ thống voting này hỗ trợ nhiều user có thể bỏ phiếu trên cùng một poll. Mỗi user chỉ được bỏ phiếu một lần per poll.

## 🚀 **Bước 1: Deploy Contracts**

### **Deploy Complete System**
```bash
# Deploy cả VotingToken và VotingContract
npx hardhat run scripts/deploy-all.js --network localhost
```

### **Cập nhật Addresses**
```bash
# Tự động cập nhật tất cả script với address mới
npx hardhat run scripts/update-addresses.js --network localhost
```

## 📋 **Các Script có sẵn**

### 1. **setup-multi-user-accounts.js**
- **Mục đích**: Thiết lập nhiều tài khoản test với token
- **Chức năng**: 
  - Tạo 5 tài khoản test
  - Chuyển 500 token cho mỗi user
  - Hiển thị private key để import vào MetaMask
- **Sử dụng**: `npx hardhat run scripts/setup-multi-user-accounts.js --network localhost`

### 2. **simple-multi-user-test.js** ⭐ **RECOMMENDED**
- **Mục đích**: Tạo poll và test multi-user voting ngay lập tức
- **Chức năng**:
  - Tạo poll mới bắt đầu ngay lập tức
  - Test voting với 3 user khác nhau
  - Hiển thị kết quả real-time
  - Không cần poll có sẵn
- **Sử dụng**: `npx hardhat run scripts/simple-multi-user-test.js --network localhost`

### 3. **quick-multi-user-test.js**
- **Mục đích**: Test nhanh voting với nhiều user trên poll hiện có
- **Chức năng**:
  - Tìm poll đang hoạt động
  - Tự động tạo poll nếu không có
  - Test voting với 3 user khác nhau
  - Hiển thị kết quả real-time
- **Sử dụng**: `npx hardhat run scripts/quick-multi-user-test.js --network localhost`

### 3. **test-multi-user-voting.js**
- **Mục đích**: Test voting với 5 user trên poll cụ thể
- **Chức năng**:
  - Test trên poll ID 1
  - Kiểm tra trạng thái poll
  - Voting với 5 user khác nhau
- **Sử dụng**: `npx hardhat run scripts/test-multi-user-voting.js --network localhost`

### 4. **create-and-test-multi-user-poll.js**
- **Mục đích**: Tạo poll mới và test với nhiều user
- **Chức năng**:
  - Tạo poll bắt đầu sau 1 phút
  - Đợi poll bắt đầu
  - Test voting với 5 user
- **Sử dụng**: `npx hardhat run scripts/create-and-test-multi-user-poll.js --network localhost`

### 5. **create-poll-and-vote-multi.js**
- **Mục đích**: Tạo poll và test ngay lập tức
- **Chức năng**:
  - Tạo poll bắt đầu ngay lập tức
  - Test voting với 5 user ngay lập tức
  - Không cần đợi
- **Sử dụng**: `npx hardhat run scripts/create-poll-and-vote-multi.js --network localhost`

## 🛠️ **Cách sử dụng đầy đủ**

### **Bước 1: Khởi động Hardhat Network**
```bash
npx hardhat node
```

### **Bước 2: Deploy contracts (QUAN TRỌNG!)**
```bash
npx hardhat run scripts/deploy-all.js --network localhost
```

### **Bước 3: Cập nhật addresses trong scripts**
```bash
npx hardhat run scripts/update-addresses.js --network localhost
```

### **Bước 4: Thiết lập multi-user accounts**
```bash
npx hardhat run scripts/setup-multi-user-accounts.js --network localhost
```

### **Bước 5: Test multi-user voting**
```bash
# Test nhanh với poll hiện có
npx hardhat run scripts/quick-multi-user-test.js --network localhost

# Hoặc tạo poll mới và test
npx hardhat run scripts/create-poll-and-vote-multi.js --network localhost
```

## 🔧 **Troubleshooting**

### **Lỗi "Cannot read properties of undefined (reading 'formatEther')"**
- **Nguyên nhân**: Sử dụng `ethers.utils.formatEther()` cũ trong phiên bản ethers mới
- **Giải pháp**: Đã được sửa tự động, sử dụng `ethers.formatEther()` thay thế
- **Kiểm tra**: Chạy `npx hardhat run scripts/test-connection-simple.js --network localhost`

### **Lỗi "could not decode result data"**
- **Nguyên nhân**: Contract chưa được deploy hoặc address sai
- **Giải pháp**: 
  1. Chạy `deploy-all.js` trước
  2. Sau đó chạy `update-addresses.js`
  3. Kiểm tra file `deployed-addresses.json`

### **Lỗi "Poll is not active"**
- Kiểm tra thời gian bắt đầu/kết thúc của poll
- Sử dụng script `advance-time.js` để tăng thời gian

### **Lỗi "Already voted"**
- User đã bỏ phiếu trong poll này
- Sử dụng tài khoản khác để test

### **Lỗi "Poll does not exist"**
- Kiểm tra poll ID có đúng không
- Sử dụng script `check-polls.js` để xem danh sách poll

## 📁 **File Output**

Sau khi chạy `deploy-all.js`, bạn sẽ có file `deployed-addresses.json`:

```json
{
  "token": "0x...",
  "contract": "0x...",
  "owner": "0x..."
}
```

## 🔑 **Cách hoạt động**

### 1. **Multiple Signers**
- Hardhat tự động tạo nhiều tài khoản test
- Mỗi tài khoản có private key riêng
- Có thể import vào MetaMask để test frontend

### 2. **Voting Process**
- Mỗi user kết nối với contract bằng `connect(user)`
- Kiểm tra user đã bỏ phiếu chưa
- Bỏ phiếu và cập nhật kết quả real-time

### 3. **Security Features**
- Mỗi user chỉ được bỏ phiếu một lần per poll
- Kiểm tra poll có đang hoạt động không
- Kiểm tra thời gian bắt đầu/kết thúc

## 📱 **Test với Frontend**

### 1. **Import Accounts vào MetaMask**
- Copy private key từ script `setup-multi-user-accounts.js`
- Import vào MetaMask
- Import token với address hiển thị

### 2. **Switch Accounts**
- Chuyển đổi giữa các tài khoản trong MetaMask
- Mỗi tài khoản có thể bỏ phiếu khác nhau

### 3. **Real-time Updates**
- Frontend sẽ hiển thị kết quả voting real-time
- Mỗi lần bỏ phiếu sẽ cập nhật UI

## 📊 **Ví dụ Output**

```
=== Deploying Complete Voting System ===

1️⃣  Deploying VotingToken...
✅ VotingToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✅ Token name: Voting Token
✅ Token symbol: VOTE

2️⃣  Deploying VotingContract...
✅ VotingContract deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
✅ Owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

🎉 Complete deployment successful!
```

## 🎯 **Kết luận**
Với các script này, bạn có thể dễ dàng test hệ thống voting với nhiều user khác nhau, mô phỏng môi trường thực tế với nhiều người tham gia bỏ phiếu.

**Lưu ý quan trọng**: Luôn chạy `deploy-all.js` và `update-addresses.js` trước khi test các script khác!
