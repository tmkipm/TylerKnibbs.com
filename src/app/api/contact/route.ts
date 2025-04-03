import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // --- TODO: Implement actual email sending logic here --- 
    console.log('--- Contact Form Submission ---');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('--- End Submission ---');

    // Example: Using Resend (requires npm install resend)
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Your Name <onboarding@resend.dev>', // Use a verified Resend domain
      to: process.env.CONTACT_EMAIL_RECIPIENT, // Your email address
      subject: `Contact Form Submission from ${name}`,
      reply_to: email,
      html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
    });
    */

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // --- End of TODO --- 

    // Always return a success response for now in the placeholder
    return NextResponse.json({ message: 'Message received successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
} 