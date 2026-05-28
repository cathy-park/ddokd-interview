import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    // Vercel Cron 요청 검증 (선택사항이지만 보안을 위해 추가)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1건만 조회하여 통신을 발생시킴으로써 DB가 sleep 상태로 전환되는 것을 방지합니다.
    const { data, error } = await supabase.from('interviews').select('id').limit(1);
    
    if (error) {
      console.error('Supabase keep-alive error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Supabase is awake!' });
  } catch (error: any) {
    console.error('Keep-alive exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
