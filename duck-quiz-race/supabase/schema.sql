-- Chạy file này trong Supabase SQL Editor

-- Bảng lưu thông tin phòng chơi
create table if not exists rooms (
  id text primary key,           -- mã phòng 4 ký tự, vd: "AB3X"
  host_id text not null,
  status text not null default 'waiting',  -- waiting | playing | finished
  questions jsonb not null default '[]',
  created_at timestamptz default now()
);

-- Bảng lưu trạng thái từng người chơi
create table if not exists players (
  id text primary key,           -- random UUID tạo client-side
  room_id text not null references rooms(id) on delete cascade,
  name text not null,
  emoji text not null default '🦆',
  color text not null default '#FFD700',
  progress float not null default 0,
  score int not null default 0,
  question_index int not null default 0,
  finished bool not null default false,
  finish_rank int,
  updated_at timestamptz default now()
);

-- Enable Realtime cho cả 2 bảng
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table players;

-- Cho phép mọi người đọc/ghi (game public, không cần auth)
alter table rooms enable row level security;
alter table players enable row level security;

create policy "public rooms" on rooms for all using (true) with check (true);
create policy "public players" on players for all using (true) with check (true);

-- Tự động xóa phòng cũ hơn 2 giờ (giữ DB sạch)
create or replace function cleanup_old_rooms()
returns void language plpgsql as $$
begin
  delete from rooms where created_at < now() - interval '2 hours';
end;
$$;
