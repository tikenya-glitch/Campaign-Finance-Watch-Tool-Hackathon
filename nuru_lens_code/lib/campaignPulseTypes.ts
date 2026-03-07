export type EventType =
  | 'rally'
  | 'convoy'
  | 'posters'
  | 'door_to_door'
  | 'giveaways'
  | 'intimidation';

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; color: string; icon: string }
> = {
  rally: { label: 'Campaign Rally', color: 'bg-green-500', icon: '🟢' },
  convoy: { label: 'Campaign Convoy', color: 'bg-orange-500', icon: '🟠' },
  posters: { label: 'Poster Activity', color: 'bg-amber-400', icon: '🟡' },
  door_to_door: { label: 'Door-to-Door Campaign', color: 'bg-blue-500', icon: '🔵' },
  giveaways: { label: 'Giveaways', color: 'bg-purple-500', icon: '🟣' },
  intimidation: { label: 'Intimidation', color: 'bg-red-500', icon: '🔴' },
};
