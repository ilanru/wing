import { ISimulatorResourceInstance } from "./resource";
import { TableAttributes, TableSchema } from "./schema-resources";
import { ColumnType, ITableClient } from "../cloud";
import { Json } from "../std";
import { ISimulatorContext } from "../testing/simulator";

export class Table implements ITableClient, ISimulatorResourceInstance {
  private name: string;
  private columns: { [key: string]: ColumnType };
  private primaryKey: string;
  private table: Map<string, any>;
  private readonly context: ISimulatorContext;

  public constructor(props: TableSchema["props"], context: ISimulatorContext) {
    this.name = props.name;
    this.columns = props.columns;
    this.primaryKey = props.primaryKey;
    this.table = new Map<string, any>();
    this.context = context;
  }

  public async init(): Promise<TableAttributes> {
    return {};
  }

  public async cleanup(): Promise<void> {}

  public async insert(row: Json): Promise<void> {
    const anyRow = row as any;
    return this.context.withTrace({
      message: `insert row ${anyRow[this.primaryKey]} into the table ${
        this.name
      }.`,
      activity: async () => {
        let item: Record<string, any> = {};
        const pk = anyRow[this.primaryKey];
        item[this.primaryKey] = anyRow[this.primaryKey];
        for (const key of Object.keys(this.columns)) {
          item[key] = anyRow[key];
        }
        this.table.set(pk, item);
      },
    });
  }
  public async update(row: Json): Promise<void> {
    const anyRow = row as any;
    return this.context.withTrace({
      message: `update row ${anyRow[this.primaryKey]} in table ${this.name}.`,
      activity: async () => {
        const pk = anyRow[this.primaryKey];
        let item = await this.get(pk);
        for (const key of Object.keys(this.columns)) {
          if (anyRow[key]) {
            item[key] = anyRow[key];
          }
        }
        this.table.set(pk, item);
      },
    });
  }
  public async delete(key: string): Promise<void> {
    return this.context.withTrace({
      message: `remove row ${key} from table ${this.name}.`,
      activity: async () => {
        this.table.delete(key);
      },
    });
  }
  public async get(key: string): Promise<any> {
    return this.context.withTrace({
      message: `get row ${key} from table ${this.name}.`,
      activity: async () => {
        return this.table.get(key);
      },
    });
  }
  public async list() {
    return this.context.withTrace({
      message: `list all rows from table ${this.name}.`,
      activity: async () => {
        return Array.from(this.table.values());
      },
    });
  }
}