import { LeadFormData } from "@/types";
import axios from "axios";
import { env } from "@/config/env";
import { success } from "zod";

export async function sendMail(data: LeadFormData, password: string) {
  const url = "https://api.mailgrid.net.br/sendmail/";
  const baseUrl = `https://${env.heimdallSubdomain}.heimdallcloud.com.br`;
  const heimdall = "https://github.com/omaatheus/pegalead/blob/main/public/heimdall.png?raw=true"
  const demaisAnaliticos = "https://github.com/omaatheus/pegalead/blob/main/public/demais-analiticos.png?raw=true"
  const intrusao = "https://github.com/omaatheus/pegalead/blob/main/public/intrusao.png?raw=true"
  const lpr_radar = "https://github.com/omaatheus/pegalead/blob/main/public/lpr-radar.png?raw=true"

  const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo à Zions Vision - Seu acesso ao Heimdall</title>
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0a0f1a; color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
        
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #0a0f1a;">
            <tr>
                <td align="center" style="padding: 0;">
                    
                    <table width="100%" max-width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0d1525; border-top: 4px solid #FACC15;">
                        
                        <tr>
                            <td align="center" style="padding: 50px 30px 30px 30px; background: linear-gradient(135deg, #0d1525 0%, #131d33 100%);">
                                <img src="https://github.com/omaatheus/pegalead/blob/main/public/logo.png?raw=true" alt="Zions Vision - Beyond the cameras" style="max-width: 200px; height: auto; display: block; margin: 0 auto;">
                                <p style="color: #FACC15; font-size: 13px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin: 15px 0 0 0; line-height: 1;">Beyond the cameras</p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 30px 30px 0 30px;">
                                <p style="font-size: 24px; font-weight: bold; color: #ffffff; margin: 0 0 10px 0;">Olá, {{nome}}!</p>
                                <p style="font-size: 16px; line-height: 1.7; color: #c9d1d9; margin: 0;">Bem-vindo à <strong style="color: #ffffff;">Zions Vision</strong>! Preparamos um acesso exclusivo para você descobrir o futuro do monitoramento inteligente, onde a <strong style="color: #FACC15;">Inteligência Artificial</strong> transforma segurança em insights precisos, em tempo real.</p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 25px 30px;">
                                <img src="{{image_heimdall}}" alt="Plataforma Heimdall de Visão Computacional" style="width: 100%; max-width: 540px; height: auto; display: block; border-radius: 8px; margin: 0 auto;">
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 30px 25px 30px;">
                                <h2 style="color: #FACC15; font-size: 22px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase;">O Poder da IA ao seu Alcance</h2>
                                <p style="font-size: 15px; line-height: 1.8; color: #b8bfc7; margin: 0 0 15px 0;">
                                    A <strong style="color: #ffffff;">Zions Vision</strong> oferece soluções inteligentes em Visão Computacional que transformam as câmeras que você já possui em instrumentos de inteligência pura.
                                </p>
                                
                                <div style="background-color: #131d33; border-left: 4px solid #FACC15; border-radius: 4px; padding: 20px; margin-bottom: 15px;">
                                    <h3 style="color: #FACC15; font-size: 16px; margin: 0 0 12px 0; text-transform: uppercase;">Heimdall: Plataforma de IA</h3>
                                    <p style="font-size: 14px; line-height: 1.7; color: #c9d1d9; margin: 0;">
                                        <strong>Monitoramento 24/7</strong> • <strong>+70M</strong> imagens processadas • <strong>+30 analíticos</strong> treinados para o Brasil • <strong>Alertas em tempo real</strong> via WhatsApp • <strong>Escalável</strong> e robusto
                                    </p>
                                </div>

                                <p style="font-size: 13px; line-height: 1.7; color: #8b9eb5; margin: 0;">
                                    A inteligência reside no nosso <strong style="color: #ffffff;">software proprietário</strong>, reduzindo custos drasticamente e oferecendo uma visão 360° de suas operações com redes neurais especializadas no cenário brasileiro.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 30px 30px 30px;">
                                <h2 style="color: #ffffff; font-size: 22px; font-weight: bold; margin: 0 0 25px 0; text-align: center;">Analíticos Inteligentes em Ação</h2>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; background-color: #131d33; border-radius: 8px; overflow: hidden;">
                                    <tr>
                                        <td style="padding: 0;">
                                            <img src="{{image_intrusion}}" alt="Detecção de Intrusão em Perímetro" style="width: 100%; display: block; height: auto;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 20px;">
                                            <h3 style="color: #FACC15; font-size: 16px; margin: 0 0 8px 0; text-transform: uppercase;">Intrusão de Perímetro</h3>
                                            <p style="font-size: 13px; line-height: 1.6; color: #c9d1d9; margin: 0;">Detecte pessoas, veículos e animais em áreas restritas com precisão milimétrica. Alertas instantâneos impedem invasões antes que ocorram.</p>
                                        </td>
                                    </tr>
                                </table>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; background-color: #131d33; border-radius: 8px; overflow: hidden;">
                                    <tr>
                                        <td style="padding: 0;">
                                            <img src="{{image_lpr}}" alt="Leitura de Placas e Radar de Velocidade" style="width: 100%; display: block; height: auto;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 20px;">
                                            <h3 style="color: #FACC15; font-size: 16px; margin: 0 0 8px 0; text-transform: uppercase;">LPR & Radar</h3>
                                            <p style="font-size: 13px; line-height: 1.6; color: #c9d1d9; margin: 0; margin-bottom: 8px;">Leitura automática de placas, fiscalização de velocidade e controle inteligente de vagas com 99% de acurácia em qualquer condição climática.</p>
                                        </td>
                                    </tr>
                                </table>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #131d33; border-radius: 8px; overflow: hidden;">
                                    <tr>
                                        <td style="padding: 0;">
                                            <img src="{{image_more_analytics}}" alt="Análise de Comportamento e Aglomeração" style="width: 100%; display: block; height: auto;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 20px;">
                                            <h3 style="color: #FACC15; font-size: 16px; margin: 0 0 8px 0; text-transform: uppercase;">Análise Comportamental</h3>
                                            <p style="font-size: 13px; line-height: 1.6; color: #c9d1d9; margin: 0;">Detecte aglomerações, inatividade suspeitosa, pânico gestual e abandono de postos. Informações valiosas em cada frame para total controle operacional.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px 0 30px;">
                                <h2 style="color: #ffffff; font-size: 22px; font-weight: bold; margin: 0 0 30px 0; text-align: center;">Quem Confia na Zions Vision</h2>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 30px 20px 30px;">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #131d33 0%, #1a2847 100%); border: 1px solid #1f2e42; border-radius: 8px; padding: 0; overflow: hidden;">
                                    <tr>
                                        <td style="padding: 25px;">
                                            <p style="font-size: 14px; font-style: italic; line-height: 1.7; color: #b8bfc7; margin: 0 0 12px 0;">
                                                "Vivenciei uma verdadeira virada de chave com os analíticos de imagens com IA da Zions. Prevenimos roubos em diversas construções que monitoramos, graças aos alertas em tempo real. A precisão elevou a segurança para um novo patamar."
                                            </p>
                                            <p style="font-size: 12px; color: #FACC15; font-weight: bold; margin: 0; text-transform: uppercase;">⭐ Márcia Abbade</p>
                                            <p style="font-size: 12px; color: #8b9eb5; margin: 0;">Proprietária | AVATAR</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 30px 20px 30px;">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #131d33 0%, #1a2847 100%); border: 1px solid #1f2e42; border-radius: 8px; padding: 0; overflow: hidden;">
                                    <tr>
                                        <td style="padding: 25px;">
                                            <p style="font-size: 14px; font-style: italic; line-height: 1.7; color: #b8bfc7; margin: 0 0 12px 0;">
                                                "Trabalhar com a Zions tem sido uma experiência excepcional. A precisão dos analíticos de imagem com IA fornecidos por eles é incomparável, o que nos permite entregar resultados consistentes aos nossos clientes."
                                            </p>
                                            <p style="font-size: 12px; color: #FACC15; font-weight: bold; margin: 0; text-transform: uppercase;">⭐ Gustavo Santos</p>
                                            <p style="font-size: 12px; color: #8b9eb5; margin: 0;">Integrador | Soluções em IA</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 30px 40px 30px;">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #131d33 0%, #1a2847 100%); border: 1px solid #1f2e42; border-radius: 8px; padding: 0; overflow: hidden;">
                                    <tr>
                                        <td style="padding: 25px;">
                                            <p style="font-size: 14px; font-style: italic; line-height: 1.7; color: #b8bfc7; margin: 0 0 12px 0;">
                                                "Estou impressionado com o suporte da Zions. Desde o início fui surpreendido pela alta qualidade dos analíticos e pela dedicação. A equipe é sempre atenciosa e pronta para ajudar, tornando a gestão muito mais tranquila e eficiente."
                                            </p>
                                            <p style="font-size: 12px; color: #FACC15; font-weight: bold; margin: 0; text-transform: uppercase;">⭐ Joel Fernandes</p>
                                            <p style="font-size: 12px; color: #8b9eb5; margin: 0;">Síndico | Gestão Condominial</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px;">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #FACC15 0%, #f59e0b 100%); border-radius: 12px; padding: 0; overflow: hidden; box-shadow: 0 8px 24px rgba(250, 204, 21, 0.3);">
                                    <tr>
                                        <td style="padding: 35px 30px;">
                                            <h2 style="color: #060d18; font-size: 24px; font-weight: bold; margin: 0 0 10px 0; text-align: center;">Seu Acesso Exclusivo</h2>
                                            <p style="font-size: 14px; line-height: 1.6; color: #78350f; margin: 0 0 30px 0; text-align: center;"><strong>As credenciais abaixo são suas! Guarde com segurança.</strong></p>

                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 18px;">
                                                <tr>
                                                    <td style="background-color: rgba(0,0,0,0.15); border-radius: 6px; padding: 15px 16px;">
                                                        <p style="font-size: 11px; color: #78350f; text-transform: uppercase; font-weight: bold; margin: 0 0 6px 0; letter-spacing: 1px;">Plataforma Web</p>
                                                        <a href="{{link_acesso}}" style="color: #060d18; text-decoration: none; font-size: 15px; font-weight: bold; word-break: break-all; display: block;">{{link_acesso}}</a>
                                                    </td>
                                                </tr>
                                            </table>

                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 18px;">
                                                <tr>
                                                    <td style="background-color: rgba(0,0,0,0.15); border-radius: 6px; padding: 15px 16px;">
                                                        <p style="font-size: 11px; color: #78350f; text-transform: uppercase; font-weight: bold; margin: 0 0 6px 0; letter-spacing: 1px;">Usuário</p>
                                                        <span style="color: #060d18; font-size: 16px; font-weight: bold; word-break: break-all; display: block; -webkit-user-select: all; user-select: all;">{{usuario}}</span>
                                                    </td>
                                                </tr>
                                            </table>

                                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="background-color: rgba(0,0,0,0.15); border-radius: 6px; padding: 15px 16px;">
                                                        <p style="font-size: 11px; color: #78350f; text-transform: uppercase; font-weight: bold; margin: 0 0 6px 0; letter-spacing: 1px;">Senha</p>
                                                        <span style="color: #060d18; font-size: 16px; font-weight: bold; word-break: break-all; display: block; -webkit-user-select: all; user-select: all;">{{senha}}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px 30px 30px; text-align: center; border-top: 1px solid #1f2e42;">
                                <h3 style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0 0 20px 0;">Conecte-se à Zions Vision</h3>
                                
                                <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; display: inline-table;">
                                    <tr>
                                        <td style="padding: 0 8px;">
                                            <a href="https://www.linkedin.com/company/zionsvision/" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; background-color: rgba(80, 100, 120, 0.3); border: 1px solid rgba(71, 85, 105, 0.5); border-radius: 11px; text-decoration: none; transition: all 0.3s ease; color: #94a3b8; font-size: 13px; font-weight: 600;">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: #94a3b8; transition: color 0.3s ease;">
                                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                    <rect x="2" y="9" width="4" height="12"></rect>
                                                    <circle cx="4" cy="4" r="2"></circle>
                                                </svg>
                                                LinkedIn
                                            </a>
                                        </td>
                                        <td style="padding: 0 8px;">
                                            <a href="https://www.instagram.com/zions.vision/" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; background-color: rgba(80, 100, 120, 0.3); border: 1px solid rgba(71, 85, 105, 0.5); border-radius: 11px; text-decoration: none; transition: all 0.3s ease; color: #94a3b8; font-size: 13px; font-weight: 600;">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: #94a3b8; transition: color 0.3s ease;">
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                                </svg>
                                                Instagram
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="background-color: #060d18; padding: 30px 40px; border-top: 1px solid #1f2e42;">
                                <p style="font-size: 13px; color: #8b9eb5; margin: 0 0 10px 0; line-height: 1.6;">
                                    <strong style="color: #FACC15;">Zions Vision</strong><br>
                                    Rua Miguel Pascoal, 104 - Vila João Jorge<br>
                                    Campinas/SP, Brasil
                                </p>
                                <p style="font-size: 12px; color: #6e7681; margin: 10px 0 0 0; line-height: 1.5;">
                                    📞 +55 (11) 5194-3960<br>
                                    📧 zions@zionstech.com<br>
                                    <br>
                                    © {{ano}} Zions Vision. Todos os direitos reservados.
                                </p>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

        </body>
        </html>`;

  const formData = {
    host_smtp: env.mailHost,
    usuario_smtp: env.mailUsername,
    senha_smtp: env.mailPassword,
    emailRemetente: env.mailFromAddress,
    nomeRemetente: env.mailFromName,
    emailDestino: [data.email],
    assunto: "Seu acesso ao Heimdall foi gerado com sucesso!",
    mensagem: htmlTemplate,
    mensagemTipo: "html",
    mensagemEncoding: env.mailEncription,
    variaveis: [
      {
        "nome": data.name,
        "usuario": data.email,
        "senha": password,
        "link_acesso": baseUrl,
        "ano": new Date().getFullYear().toString(),
        "image_intrusion": intrusao,
        "image_lpr": lpr_radar,
        "image_more_analytics": demaisAnaliticos,
        "image_heimdall": heimdall
      }
    ],
    mensagemAlt: `Olá ${data.name}. O Heimdall é uma plataforma de monitoramento inteligente... Seu acesso: Link: https://${env.heimdallSubdomain}.heimdallcloud.com.br | Usuário: ${data.email} | Senha: ${password}`,
  };

  try {
    const response = await axios.post(url, formData, {
        headers: {
            "Content-Type": "application/json",
            "token_auth": `${env.mailToken}`,
            "usuario_smtp": `${env.mailUsername}`,
            "senha_smtp": `${env.mailPassword}`
        },
        maxRedirects: 10,
        timeout: 10000, 
        httpAgent: new (require('http').Agent)({ keepAlive: true })
    });

    console.log("Email enviado com sucesso:", response.data);
    return {success: true, response: response.data};

  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
}