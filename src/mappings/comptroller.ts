import { Market as NewMarket } from "../../generated/templates";
import { MarketListed } from "../../generated/templates/Comptroller/Comptroller";
import { Market } from "../../generated/schema";

export function handleMarketListed(event: MarketListed): void {
  let market = new Market(event.params.cToken.toHexString());
  market.pool = event.address.toHexString();
  market.save();

  // Start indexing the market
  NewMarket.create(event.params.cToken);
}
