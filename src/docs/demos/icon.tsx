import { Icon, iconNames } from '@/components/liquid-glass/controls/Icon'

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-4 text-neutral-700 dark:text-neutral-300">
      {iconNames.map((name) => (
        <Icon key={name} name={name} size={18} />
      ))}
    </div>
  )
}
