import { formatIDRDisplay } from "../components/money/formatIDRDisplay";

export type SplitParticipant = {
  name: string;
  share: number;
};

export function splitEqually(
  total: number,
  participantCount: number
): number[] {
  if (participantCount <= 0) return [];
  const base = Math.floor(total / participantCount);
  const remainder = total - base * participantCount;
  return Array.from({ length: participantCount }, (_, index) =>
    index < remainder ? base + 1 : base
  );
}

export function sumShares(shares: number[]): number {
  return shares.reduce((sum, share) => sum + share, 0);
}

export function getRemainingToAssign(total: number, shares: number[]): number {
  return total - sumShares(shares);
}

export function isSplitBalanced(total: number, shares: number[]): boolean {
  return sumShares(shares) === total;
}

export function formatSplitSummary(
  vendorName: string,
  totalAmount: number,
  participants: SplitParticipant[]
): string {
  return [
    `${vendorName} — ${formatIDRDisplay(totalAmount)}`,
    ...participants.map(
      (participant) =>
        `${participant.name}: ${formatIDRDisplay(participant.share)}`
    ),
  ].join("\n");
}
