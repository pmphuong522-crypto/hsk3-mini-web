# HSK3 Mini Web V38 — bật tài khoản và đồng bộ đa thiết bị

## Vì sao cần bước này?
V37 lưu kết quả trong `localStorage`, chỉ tồn tại trên từng trình duyệt. Muốn giáo viên xem kết quả của học viên dùng điện thoại/máy tính khác nhau, cần backend có đăng nhập và phân quyền. V38 tích hợp sẵn giao diện và adapter Supabase nhưng chưa thể kết nối cho tới khi chủ dự án cung cấp URL/key.

## 1. Tạo project Supabase
1. Tạo project tại https://supabase.com/.
2. Vào Project Settings → API, sao chép Project URL và anon/public key.
3. Điền hai giá trị vào `supabase-config.js` (`url`, `anonKey`). Không đưa `service_role` key vào website.
4. Trong Authentication → Providers, bật Email. Khi thử nghiệm có thể bật/tắt xác minh email theo nhu cầu.

## 2. Tạo bảng và chính sách bảo mật
Chạy SQL sau trong SQL Editor:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'student' check (role in ('student','teacher')),
  created_at timestamptz not null default now()
);

create table if not exists public.answer_events (
  id bigint generated always as identity primary key,
  student_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  word_id text,
  lesson integer,
  exercise_type integer,
  skill text,
  is_correct boolean not null,
  is_review boolean not null default false,
  wrong_count integer not null default 0,
  session_id text,
  answered_at timestamptz not null default now()
);
create index if not exists answer_events_student_time on public.answer_events(student_id, answered_at desc);
alter table public.profiles enable row level security;
alter table public.answer_events enable row level security;

create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='teacher') $$;

create policy "read own profile or teacher" on public.profiles for select to authenticated
using (id=auth.uid() or public.is_teacher());
create policy "student creates own profile" on public.profiles for insert to authenticated
with check (id=auth.uid() and role='student');
-- Không tạo policy cho người dùng tự update role. Chỉ quản trị viên cấp role teacher qua SQL/dashboard.
create policy "students insert own answers" on public.answer_events for insert to authenticated
with check (student_id=auth.uid());
create policy "students read own answers" on public.answer_events for select to authenticated
using (student_id=auth.uid());
create policy "teachers read all answers" on public.answer_events for select to authenticated
using (public.is_teacher());
```

## 3. Tạo profile cho tài khoản mới
Sau khi đăng ký trong `account.html`, nếu project chưa tự tạo profile thì chạy SQL thay UUID bằng ID từ Authentication → Users:

```sql
insert into public.profiles(id, display_name, role)
values ('UUID-TU-AUTH-USERS', 'Tên giáo viên', 'teacher')
on conflict (id) do update set role='teacher', display_name=excluded.display_name;
```

Với học viên, dùng role `student`. Chỉ giáo viên được cấp role `teacher` mới xem được Dashboard. Hãy giữ chặt quyền này.

## 4. Những gì V38 đã có / giới hạn hiện tại
- Ôn tập câu sai trên cùng trình duyệt, câu đúng trong chế độ ôn được đánh dấu đã củng cố.
- Đăng ký/đăng nhập email-mật khẩu qua Supabase sau khi cấu hình.
- Gửi các lượt trả lời mới lên `answer_events` khi người dùng đã đăng nhập.
- Dashboard giáo viên cơ bản: số học viên có hoạt động, lượt trả lời, tỷ lệ đúng, câu sai và thời điểm hoạt động.
- Chưa có quản lý lớp, mời học viên, đặt lại mật khẩu tùy chỉnh, đồng bộ hàng đợi câu sai giữa các thiết bị, hay tải lịch sử cũ từ localStorage lên cloud. Các mục này nên làm sau khi xác nhận Supabase hoạt động và chốt mô hình lớp học.
- Dữ liệu ôn sai hiện lưu cục bộ; để có cùng danh sách câu sai trên mọi thiết bị cần thêm bảng `wrong_questions` và đồng bộ trạng thái. V38 giữ cơ chế ôn sai hoạt động ngay cả khi chưa cấu hình máy chủ.
