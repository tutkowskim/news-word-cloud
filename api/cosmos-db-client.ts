import { CosmosClient } from "@azure/cosmos";

export class CosmosDbClient {
  private client: CosmosClient;

  constructor() {
    this.client = new CosmosClient({ 
      endpoint: process.env.COSMOS_DB_ENDPOINT || '', 
      key: process.env.COSMOS_DB_KEY || '',
    });
  }

  public async getMiningPayouts(): Promise<any[]> {
    const container = await this.getMiningPayoutsContainer();
    const { resources } = await container.items.readAll().fetchAll();
    return resources.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public async getMiningPowerUsage(): Promise<any[]> {
    const container = await this.getMiningPowerUsageContainer();
    const { resources } = await container.items.readAll().fetchAll();
    return resources.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async getMonthlyStatistics(): Promise<any[]> {
    const stats: any = {};

    const getMonth = (dateStr: string) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    const miningPayouts = await this.getMiningPayouts();
    miningPayouts.forEach(payout => {
      const month = getMonth(payout.timestamp);
      const income = payout.income + (stats[month]?.income || 0);
      stats[month] = { month, income };
    });

    const powerUsages = await this.getMiningPowerUsage();
    powerUsages.forEach(powerUsage => {
      const month = getMonth(powerUsage.date);
      const income = stats[month].income;
      const cost = powerUsage.power_usage_kw * powerUsage.usd_per_kw + (stats[month]?.cost || 0);
      stats[month] = { month, cost, income };
    });

    Object.keys(stats).forEach(month => {
      stats[month]['profit'] = (stats[month]?.income || 0) - (stats[month]?.cost || 0);
    });

    return Object.values<any>(stats).sort((a,b) => new Date(b.month).getTime() - new Date(a.month).getTime());
  }

  private async getCryptoDatabase() {
    const { database } = await this.client.databases.createIfNotExists({ id: "Crypto" });
    return database;
  }

  private async getMiningPowerUsageContainer() {
    const database = await this.getCryptoDatabase();
    const { container } = await database.containers.createIfNotExists({ id: "MiningPowerUsage", partitionKey: '/date' });
    return container;
  }

  private async getMiningPayoutsContainer() {
    const database = await this.getCryptoDatabase();
    const { container } = await database.containers.createIfNotExists({ id: "MiningPayouts", partitionKey: '/timestamp' });
    return container;
  }
}
