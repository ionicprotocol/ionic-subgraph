import { Comptroller } from "../../generated/templates";
import { PoolRegistered } from "../../generated/PoolDirectory/PoolDirectory";
import { Pool } from "../../generated/schema";

export function handlePoolRegistered(event: PoolRegistered): void {
  // Start indexing the comptroller
  Comptroller.create(event.params.pool.comptroller);
  let pool = new Pool(event.params.pool.comptroller.toHexString());
  pool.comptroller = event.params.pool.comptroller;
  pool.creator = event.params.pool.creator;
  pool.index = event.params.index;
  pool.name = event.params.pool.name;
  pool.save();
}
