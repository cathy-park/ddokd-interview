import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1차 견적 데이터
    const type = formData.get('type') as string;
    const pages = formData.get('pages') as string;
    const components = formData.get('components') as string;
    const boards = formData.get('boards') as string;
    const features = formData.get('features') as string;
    const price_range = formData.get('priceRange') as string;
    const sections = parseInt(formData.get('sections') as string);
    const total_price = parseInt(formData.get('totalPrice') as string);
    const data_readiness = formData.get('dataReadiness') as string;
    const design_level = formData.get('designLevel') as string;

    const adminEmail = process.env.ADMIN_EMAIL || 'yany@ddokd.com';
    
    try {
      const emailResponse = await resend.emails.send({
        from: '똑디 인터뷰 <info@ddokd.com>', // 도메인 인증이 완료되었으므로 전용 주소 사용
        to: adminEmail,
        subject: `[똑디 간편견적 알림] 누군가 기본 견적서를 확인했습니다.`,
        html: `
          <div style="font-family: 'Pretendard', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #000; padding: 50px; color: #000; background: #fff;">
            <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 30px; border-bottom: 8px solid #000; padding-bottom: 10px; display: inline-block;">NEW BASIC QUOTE VIEW</h1>
            
            <p style="font-size: 14px; margin-bottom: 20px;">고객이 상세 브리프를 작성하기 전, 간편 견적 결과를 확인했습니다.</p>
            
            <div style="background: #000; padding: 30px; color: #fff; margin-bottom: 40px;">
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 0 10px 0; color: #888;">Expected Production Cost</p>
              <p style="font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.02em;">₩ ${price_range}</p>
              <div style="margin-top: 20px; font-size: 11px; color: #666; font-weight: bold;">
                  유형: ${type} | 총 섹션: ${sections}개 | 디자인: ${design_level}
              </div>
            </div>

            <h2 style="font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; border-left: 4px solid #000; padding-left: 10px; margin-bottom: 20px;">Quote Details</h2>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-bottom: 40px;">
              <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; width: 120px; font-weight: 900;">유형</td>
                  <td style="padding: 12px 0; font-weight: 700;">${type}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-weight: 900;">페이지 구성</td>
                  <td style="padding: 12px 0;">${pages}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-weight: 900;">게시판</td>
                  <td style="padding: 12px 0;">${boards || '없음'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-weight: 900;">추가 기능</td>
                  <td style="padding: 12px 0;">${features || '없음'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-weight: 900;">자료 준비상태</td>
                  <td style="padding: 12px 0;">${data_readiness}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888; font-weight: 900;">디자인 수준</td>
                  <td style="padding: 12px 0;">${design_level}</td>
              </tr>
            </table>
            
            <p style="font-size: 12px; color: #888;">* 이 알림은 고객이 간편 견적 결과(6단계)를 확인했을 때 발송됩니다.</p>
          </div>
        `,
      });

      if (emailResponse.error) {
        console.error('Resend email error (Basic):', emailResponse.error);
      } else {
        console.log('Basic Resend email sent successfully:', emailResponse.data);
      }
    } catch (emailErr) {
      console.error('Failed to send basic email via Resend:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Basic Submission error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
