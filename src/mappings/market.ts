import { BigInt } from "@graphprotocol/graph-ts";
import {
  Borrow,
  Mint,
  Redeem,
  RepayBorrow,
  Transfer,
} from "../../generated/templates/Market/Market";
import { User, UserMarket } from "../../generated/schema";

export function handleBorrow(event: Borrow): void {
  let user = User.load(event.params.borrower.toHexString());
  if (user == null) {
    user = new User(event.params.borrower.toHexString());
    user.save();
  }
  let userMarketId =
    event.params.borrower.toHexString() + "-" + event.address.toHexString();
  let userMarket = UserMarket.load(userMarketId);
  if (userMarket == null) {
    userMarket = new UserMarket(userMarketId);
    userMarket.user = event.params.borrower.toHexString();
    userMarket.market = event.address.toHexString();
    userMarket.supplyBalance = new BigInt(0);
  }
  userMarket.borrowBalance = event.params.accountBorrows;
  userMarket.save();
}

export function handleMint(event: Mint): void {
  let user = User.load(event.params.minter.toHexString());
  if (user == null) {
    user = new User(event.params.minter.toHexString());
  }
  user.save();
  let userMarketId =
    event.params.minter.toHexString() + "-" + event.address.toHexString();
  let userMarket = UserMarket.load(userMarketId);
  if (userMarket == null) {
    userMarket = new UserMarket(userMarketId);
    userMarket.user = event.params.minter.toHexString();
    userMarket.market = event.address.toHexString();
    userMarket.borrowBalance = new BigInt(0);
    userMarket.supplyBalance = event.params.mintAmount;
  } else {
    userMarket.supplyBalance = userMarket.supplyBalance.plus(
      event.params.mintAmount
    );
  }
  userMarket.save();
}

export function handleRepayBorrow(event: RepayBorrow): void {
  let userMarketId =
    event.params.borrower.toHexString() + "-" + event.address.toHexString();
  let userMarket = UserMarket.load(userMarketId)!;
  if (!userMarket) {
    userMarket = new UserMarket(userMarketId);
    userMarket.user = event.params.borrower.toHexString();
    userMarket.market = event.address.toHexString();
    userMarket.borrowBalance = new BigInt(0);
    userMarket.supplyBalance = new BigInt(0);
  }
  userMarket.borrowBalance = event.params.accountBorrows;
  userMarket.save();
}

export function handleRedeem(event: Redeem): void {
  let userMarketId =
    event.params.redeemer.toHexString() + "-" + event.address.toHexString();
  let userMarket = UserMarket.load(userMarketId)!;
  userMarket.supplyBalance = userMarket.supplyBalance.minus(
    event.params.redeemAmount
  );
  userMarket.save();
}

export function handleTransfer(event: Transfer): void {
  let fromUserMarketId =
    event.params.from.toHexString() + "-" + event.address.toHexString();
  let fromUserMarket = UserMarket.load(fromUserMarketId);
  if (fromUserMarket == null) {
    fromUserMarket = new UserMarket(fromUserMarketId);
    fromUserMarket.user = event.params.from.toHexString();
    fromUserMarket.market = event.address.toHexString();
    fromUserMarket.borrowBalance = new BigInt(0);
    fromUserMarket.supplyBalance = new BigInt(0);
  } else {
    fromUserMarket.supplyBalance = fromUserMarket.supplyBalance.minus(
      event.params.amount
    );
  }
  fromUserMarket.save();

  let toUserMarketId =
    event.params.to.toHexString() + "-" + event.address.toHexString();
  let toUserMarket = UserMarket.load(toUserMarketId);
  if (toUserMarket == null) {
    toUserMarket = new UserMarket(toUserMarketId);
    toUserMarket.user = event.params.to.toHexString();
    toUserMarket.market = event.address.toHexString();
    toUserMarket.borrowBalance = new BigInt(0);
    toUserMarket.supplyBalance = new BigInt(0);
  }
  toUserMarket.supplyBalance = toUserMarket.supplyBalance.plus(
    event.params.amount
  );
  toUserMarket.save();
}
