import { ANALYTICS_OPTIONS } from './analytics.ts';

/**
 * Agrupamento apenas VISUAL dos analíticos. Os IDs e labels continuam vindo de
 * ANALYTICS_OPTIONS; qualquer ID não listado aqui cai em "Outros analíticos",
 * então nenhuma opção some da tela.
 */
const GROUP_DEFINITIONS: { title: string; ids: string[] }[] = [
  {
    title: 'Pessoas e comportamento',
    ids: ['intrusion', 'evasion', 'agglomeration', 'permanence', 'inactivity', 'panic'],
  },
  {
    title: 'Veículos',
    ids: ['vehicle_intrusion', 'vehicle_agglomeration', 'vehicle_evasion', 'lpr', 'radar'],
  },
  {
    title: 'Ambiente e operação',
    ids: ['animal_intrusion', 'epi_intrusion', 'epi_evasion', 'scene_change', 'time_lapse', 'inactive_camera'],
  },
];

export function getAnalyticsGroups() {
  const byId = new Map(ANALYTICS_OPTIONS.map((o) => [o.id, o]));
  const used = new Set<string>();

  const groups = GROUP_DEFINITIONS.map((g) => ({
    title: g.title,
    options: g.ids.flatMap((id) => {
      const option = byId.get(id);
      if (!option) return [];
      used.add(id);
      return [option];
    }),
  })).filter((g) => g.options.length > 0);

  const others = ANALYTICS_OPTIONS.filter((o) => !used.has(o.id));
  if (others.length > 0) groups.push({ title: 'Outros analíticos', options: others });

  return groups;
}
