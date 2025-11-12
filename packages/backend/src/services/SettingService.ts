import { AppDataSource } from '../config/database';
import { Setting } from "../entities/Setting";

export class SettingService {
  private repo = AppDataSource.getRepository(Setting);

  async getByTenant(tenantId: string) {
    return await this.repo.findOne({ where: { tenantId } });
  }

  async update(tenantId: string, data: Partial<Setting>) {
    let settings = await this.repo.findOne({ where: { tenantId } });

    if (!settings) {
      settings = this.repo.create({ tenantId, ...data });
    } else {
      Object.assign(settings, data);
    }

    return await this.repo.save(settings);
  }
}
