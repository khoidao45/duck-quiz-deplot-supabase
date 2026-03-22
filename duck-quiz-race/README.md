# 🦆 Duck Quiz Race

Game đua vịt quiz multiplayer real-time — React + Supabase + Vercel.

---

## ⚡ Setup nhanh (5 bước)

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo project trên Supabase

1. Vào [supabase.com](https://supabase.com) → **New project**
2. Đặt tên, chọn region (Singapore gần VN nhất)
3. Đợi project khởi động (~1 phút)

### 3. Tạo database schema

1. Vào **SQL Editor** trong Supabase dashboard
2. Copy toàn bộ nội dung file `supabase/schema.sql`
3. Paste vào SQL Editor → **Run**

### 4. Cấu hình environment variables

```bash
cp .env.example .env
```

Điền vào `.env`:
- `VITE_SUPABASE_URL` → lấy từ Supabase: **Settings → API → Project URL**
- `VITE_SUPABASE_ANON_KEY` → lấy từ Supabase: **Settings → API → anon public**

```env
VITE_SUPABASE_URL=https://abcdefghij.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Chạy local

```bash
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173) 🚀

---

## 🌐 Deploy lên Vercel

### Option A: Deploy qua Vercel CLI

```bash
npm install -g vercel
vercel
```

Khi deploy, thêm environment variables:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Option B: Deploy qua GitHub (khuyến nghị)

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → **Import Project** → chọn repo
3. Thêm environment variables trong Vercel dashboard
4. **Deploy!**

---

## 🎮 Cách chơi

1. **Tạo phòng**: nhập tên → Tạo phòng → nhận mã 4 ký tự
2. **Mời bạn**: chia sẻ mã phòng
3. **Vào phòng**: bạn bè nhập tên + mã → Vào phòng
4. **Bắt đầu**: host bấm "Bắt đầu đua!"
5. **Race**: vịt tự bơi, gặp `?` thì dừng trả lời câu hỏi
   - ✅ Đúng → vịt nhảy vọt về phía trước (+10 điểm)
   - ❌ Sai/hết giờ → vịt lùi lại chút
6. Ai về đích trước thắng! 🏁

---

## 🗂️ Cấu trúc project

```
src/
├── components/
│   ├── Lobby.jsx          # Màn hình đăng nhập/tạo phòng
│   ├── WaitingRoom.jsx    # Phòng chờ + hiển thị mã phòng
│   ├── GameCanvas.jsx     # Canvas đua vịt + game loop
│   ├── QuestionBox.jsx    # Overlay câu hỏi với đếm ngược
│   └── WinnerScreen.jsx   # Bảng xếp hạng kết quả
├── hooks/
│   └── useGameRoom.js     # Toàn bộ logic Supabase Realtime
├── data/
│   └── questions.js       # Ngân hàng câu hỏi (dễ thêm)
├── lib/
│   └── supabase.js        # Supabase client
└── App.jsx                # Router chính
supabase/
└── schema.sql             # Chạy trong Supabase SQL Editor
```

---

## ➕ Thêm câu hỏi

Mở `src/data/questions.js` và thêm vào mảng `ALL_QUESTIONS`:

```js
{ q: "Câu hỏi của bạn?", opts: ["A", "B", "C", "D"], ans: 0 }
//                                                          ↑ index đáp án đúng (0-3)
```

---

## 🛠️ Tech stack

| Công nghệ | Dùng cho |
|-----------|----------|
| React 18 | UI |
| Vite | Build tool |
| Supabase Realtime | Sync real-time giữa người chơi |
| Supabase PostgreSQL | Lưu trạng thái phòng và người chơi |
| HTML Canvas | Render animation đua vịt |
| Vercel | Hosting |
