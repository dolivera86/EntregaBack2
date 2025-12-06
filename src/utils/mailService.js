import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        this.fromEmail = process.env.SMTP_USER || 'noreply@ecommerce.com';
        this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    }

    async sendPasswordResetEmail(email, userName, resetToken) {
        try {
            const resetLink = `${this.frontendUrl}/reset-password?token=${resetToken}`;

            const mailOptions = {
                from: this.fromEmail,
                to: email,
                subject: 'Recupera tu contraseña - ECommerce',
                html: this.getPasswordResetTemplate(userName, resetLink)
            };

            return await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error enviando email de recuperación:', error);
            throw new Error('No se pudo enviar el email de recuperación');
        }
    }

    async sendPurchaseConfirmationEmail(email, userName, ticketData) {
        try {
            const mailOptions = {
                from: this.fromEmail,
                to: email,
                subject: `Confirmación de compra - Ticket ${ticketData.code}`,
                html: this.getPurchaseConfirmationTemplate(userName, ticketData)
            };

            return await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error enviando email de confirmación:', error);
            throw new Error('No se pudo enviar el email de confirmación');
        }
    }

    getPasswordResetTemplate(userName, resetLink) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
                    .header { color: #333; text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
                    .content { margin: 20px 0; color: #666; }
                    .button { 
                        display: inline-block; 
                        background-color: #007bff; 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 4px; 
                        margin: 20px 0;
                    }
                    .warning { background-color: #fff3cd; padding: 10px; border-radius: 4px; margin: 20px 0; color: #856404; }
                    .footer { text-align: center; color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Recupera tu Contraseña</h1>
                    </div>
                    <div class="content">
                        <p>Hola ${userName},</p>
                        <p>Has solicitado recuperar tu contraseña. Haz clic en el botón de abajo para establecer una nueva contraseña.</p>
                        <a href="${resetLink}" class="button">Recuperar Contraseña</a>
                        <div class="warning">
                            <strong>Importante:</strong> Este enlace expira en 1 hora. Si no solicitaste recuperar tu contraseña, ignora este email.
                        </div>
                        <p>Si el botón no funciona, copia este enlace en tu navegador:</p>
                        <p style="word-break: break-all; color: #007bff;">${resetLink}</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 ECommerce. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    getPurchaseConfirmationTemplate(userName, ticketData) {
        const productsHTML = ticketData.products
            .map(
                (p) => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${p.title}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${p.unit_price.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${p.total_price.toFixed(2)}</td>
            </tr>
            `
            )
            .join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
                    .ticket-code { font-size: 24px; font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .total-row { background-color: #f9f9f9; font-weight: bold; }
                    .success { color: #28a745; }
                    .footer { text-align: center; color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>¡Compra Confirmada!</h1>
                        <p class="ticket-code">Ticket: ${ticketData.code}</p>
                    </div>
                    <div>
                        <p>Hola ${userName},</p>
                        <p>Tu compra ha sido procesada exitosamente.</p>
                        
                        <h3>Detalles del Ticket:</h3>
                        <table>
                            <thead>
                                <tr style="background-color: #f0f0f0;">
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Producto</th>
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cantidad</th>
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Precio Unit.</th>
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productsHTML}
                                <tr class="total-row">
                                    <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">TOTAL:</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${ticketData.amount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <p><span class="success">✓ Estado:</span> ${ticketData.status === 'completed' ? 'Compra Completa' : ticketData.status === 'partial' ? 'Compra Parcial - Algunos productos no tenían stock' : 'Compra Fallida'}</p>
                        <p style="color: #666; font-size: 12px;">Fecha: ${new Date(ticketData.purchase_datetime).toLocaleString('es-AR')}</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 ECommerce. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}

export default new MailService();