HSK3 Mini Web V1 — Flashcard + Dictionary + PWA

Bản sạch trước khi đưa lên GitHub Pages.

Đã chốt:
- Giao diện Flashcard hiện tại được giữ nguyên.
- Dictionary có thể mở trong lúc học; click từ Hán trong câu vẫn tra được.
- Nút “Xem đáp án” chỉ hiển thị nghĩa tiếng Việt, không lặp lại câu tiếng Trung.
- Audio dùng đường dẫn tương đối: audio/word/{ID}.mp3 và audio/example/{ID}_{n2}.mp3.
- PWA: manifest.webmanifest + sw.js.

Cấu trúc audio cần đặt cùng thư mục project:
audio/word/H3-001.mp3 ...
audio/example/H3-001_01.mp3 ...

Triển khai GitHub Pages:
1. Upload toàn bộ nội dung project lên repository (không upload ZIP).
2. Đặt thư mục audio/ ở cùng cấp với index.html.
3. Settings → Pages → Deploy from a branch → main → /(root).
4. Mở URL HTTPS của GitHub Pages và test audio + Dictionary trên điện thoại.
