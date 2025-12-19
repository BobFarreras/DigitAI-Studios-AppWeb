import { ContactFormData } from '@/lib/validations/contact';
import { SupabaseContactRepository } from '@/repositories/supabase/SupabaseContactRepository';
import { NodemailerAdapter } from '@/adapters/nodemailer/NodemailerAdapter';

export class ContactService {
  // Injectem dependències al constructor
  constructor(
    private repository: SupabaseContactRepository,
    private mailer: NodemailerAdapter
  ) { }
  private PAGE_SIZE = 10; // 👈 Constant de negoci
  async processContactForm(data: ContactFormData) {
    // 1. Guardar a DB (Si falla això, parem i salta error)
    const savedLead = await this.repository.create(data);

    // 2. Enviar Email a l'empresa
    // Construïm l'HTML aquí o en un helper separat
    const htmlContent = `
      <h2>Nou contacte de: ${data.fullName}</h2>
      <p><strong>Servei:</strong> ${data.service}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Missatge:</strong><br/>${data.message}</p>
    `;

    // Intentem enviar el correu
    // Posem un try/catch aquí perquè si falla l'email, 
    // NO volem dir-li a l'usuari que ha fallat tot (ja hem guardat el lead)
    try {
      await this.mailer.sendMail({
        to: 'info@digitaistudios.com',
        subject: `🚀 Nou Lead Web: ${data.service}`,
        html: htmlContent
      });
    } catch (emailError) {
      console.error('⚠️ Lead guardat però error enviant email:', emailError);
      // Opcional: Podries guardar un log d'error a DB
    }

    return savedLead;
  }

  async getDashboardLeads(page: number = 1) {
    // Validem que la pàgina no sigui negativa
    const currentPage = page < 1 ? 1 : page;

    const result = await this.repository.getPaginated(currentPage, this.PAGE_SIZE);

    return {
      leads: result.data,
      metadata: {
        total: result.total,
        page: currentPage,
        pageSize: this.PAGE_SIZE,
        totalPages: Math.ceil(result.total / this.PAGE_SIZE)
      }
    };
  }
  async getLeadDetails(id: string) {
    return await this.repository.getById(id);

  }
  async deleteLead(id: string) {
    return await this.repository.delete(id);
  }
}