import { useState } from 'react'
import type { Character, WeaponEntry, ArmourEntry, EquipmentEntry } from '@/types/character'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NumberStepper } from '@/components/ui/NumberStepper'

interface EquipmentPanelProps {
  character: Character
  readOnly?: boolean
  onAddWeapon: (w: Omit<WeaponEntry, 'id'>) => void
  onRemoveWeapon: (id: string) => void
  onAddArmour: (a: Omit<ArmourEntry, 'id'>) => void
  onRemoveArmour: (id: string) => void
  onToggleArmour: (id: string) => void
  onAddEquipment: (e: Omit<EquipmentEntry, 'id'>) => void
  onRemoveEquipment: (id: string) => void
  onCurrencyChange: (currency: Partial<Character['currency']>) => void
}

export function EquipmentPanel({
  character,
  readOnly = false,
  onAddWeapon,
  onRemoveWeapon,
  onAddArmour,
  onRemoveArmour,
  onToggleArmour,
  onAddEquipment,
  onRemoveEquipment,
  onCurrencyChange,
}: EquipmentPanelProps) {
  const [addingWeapon, setAddingWeapon] = useState(false)
  const [addingArmour, setAddingArmour] = useState(false)
  const [addingItem, setAddingItem] = useState(false)

  const [weaponForm, setWeaponForm] = useState({ name: '', bonus: 0, damageType: '', damageDice: '1d6', special: '' })
  const [armourForm, setArmourForm] = useState({ name: '', deflectBonus: 0, weight: '', isEquipped: false })
  const [itemForm, setItemForm] = useState({ name: '', quantity: 1, weight: '', price: '' })

  const panelStyle = {
    background: 'var(--color-storm)',
    border: '1px solid var(--color-storm-light)',
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Currency */}
      <div
        className="rounded-lg p-4"
        style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
          Currency
        </h3>
        <div className="flex gap-4">
          {(['broams', 'marks', 'chips'] as const).map(k => (
            <div key={k} className="flex flex-col items-center gap-1">
              <span className="text-xs capitalize" style={{ color: 'var(--color-fog)' }}>{k}</span>
              {readOnly ? (
                <span className="text-lg font-bold" style={{ color: 'var(--color-gold-bright)' }}>
                  {character.currency[k]}
                </span>
              ) : (
                <NumberStepper
                  value={character.currency[k]}
                  min={0}
                  onChange={v => onCurrencyChange({ [k]: v })}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weapons */}
      <div
        className="rounded-lg p-4"
        style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
            Weapons
          </h3>
          {!readOnly && (
            <Button variant="ghost" size="sm" onClick={() => setAddingWeapon(v => !v)}>
              {addingWeapon ? 'Cancel' : '+ Add'}
            </Button>
          )}
        </div>

        {addingWeapon && (
          <div className="mb-3 p-3 rounded flex flex-col gap-2" style={panelStyle}>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Name" value={weaponForm.name} onChange={v => setWeaponForm(f => ({ ...f, name: v }))} />
              <Input label="Damage Dice" value={weaponForm.damageDice} onChange={v => setWeaponForm(f => ({ ...f, damageDice: v }))} placeholder="2d6" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Damage Type" value={weaponForm.damageType} onChange={v => setWeaponForm(f => ({ ...f, damageType: v }))} placeholder="Slashing" />
              <Input label="Bonus" value={String(weaponForm.bonus)} onChange={v => setWeaponForm(f => ({ ...f, bonus: Number(v) || 0 }))} type="number" />
            </div>
            <Input label="Special" value={weaponForm.special} onChange={v => setWeaponForm(f => ({ ...f, special: v }))} placeholder="Reach, Thrown…" />
            <Button variant="primary" size="sm" onClick={() => {
              if (!weaponForm.name.trim()) return
              onAddWeapon(weaponForm)
              setWeaponForm({ name: '', bonus: 0, damageType: '', damageDice: '1d6', special: '' })
              setAddingWeapon(false)
            }}>Add Weapon</Button>
          </div>
        )}

        {character.weapons.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-fog)' }}>No weapons.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {character.weapons.map(w => (
              <div key={w.id} className="flex items-center justify-between p-2.5 rounded" style={panelStyle}>
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-pale)' }}>{w.name}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--color-fog)' }}>
                    {w.damageDice} {w.damageType}
                    {w.bonus !== 0 && ` (${w.bonus >= 0 ? '+' : ''}${w.bonus})`}
                    {w.special && ` · ${w.special}`}
                  </span>
                </div>
                {!readOnly && (
                  <button type="button" onClick={() => onRemoveWeapon(w.id)} className="text-xs hover:opacity-70" style={{ color: 'var(--color-fog)' }}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Armour */}
      <div
        className="rounded-lg p-4"
        style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
            Armour
          </h3>
          {!readOnly && (
            <Button variant="ghost" size="sm" onClick={() => setAddingArmour(v => !v)}>
              {addingArmour ? 'Cancel' : '+ Add'}
            </Button>
          )}
        </div>

        {addingArmour && (
          <div className="mb-3 p-3 rounded flex flex-col gap-2" style={panelStyle}>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Name" value={armourForm.name} onChange={v => setArmourForm(f => ({ ...f, name: v }))} />
              <Input label="Deflect Bonus" value={String(armourForm.deflectBonus)} onChange={v => setArmourForm(f => ({ ...f, deflectBonus: Number(v) || 0 }))} type="number" />
            </div>
            <Input label="Weight" value={armourForm.weight} onChange={v => setArmourForm(f => ({ ...f, weight: v }))} placeholder="Light / Medium / Heavy" />
            <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-fog)' }}>
              <input type="checkbox" checked={armourForm.isEquipped} onChange={e => setArmourForm(f => ({ ...f, isEquipped: e.target.checked }))} />
              Start equipped
            </label>
            <Button variant="primary" size="sm" onClick={() => {
              if (!armourForm.name.trim()) return
              onAddArmour(armourForm)
              setArmourForm({ name: '', deflectBonus: 0, weight: '', isEquipped: false })
              setAddingArmour(false)
            }}>Add Armour</Button>
          </div>
        )}

        {character.armour.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-fog)' }}>No armour.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {character.armour.map(a => (
              <div key={a.id} className="flex items-center justify-between p-2.5 rounded" style={panelStyle}>
                <div className="flex items-center gap-2">
                  {!readOnly && (
                    <input type="checkbox" checked={a.isEquipped} onChange={() => onToggleArmour(a.id)} />
                  )}
                  <span className="text-sm" style={{ color: a.isEquipped ? 'var(--color-pale)' : 'var(--color-fog)' }}>
                    {a.name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
                    Deflect +{a.deflectBonus} · {a.weight}
                  </span>
                  {a.isEquipped && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-stormlight)', color: '#fff' }}>
                      Equipped
                    </span>
                  )}
                </div>
                {!readOnly && (
                  <button type="button" onClick={() => onRemoveArmour(a.id)} className="text-xs hover:opacity-70" style={{ color: 'var(--color-fog)' }}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* General Equipment */}
      <div
        className="rounded-lg p-4"
        style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
            Items
          </h3>
          {!readOnly && (
            <Button variant="ghost" size="sm" onClick={() => setAddingItem(v => !v)}>
              {addingItem ? 'Cancel' : '+ Add'}
            </Button>
          )}
        </div>

        {addingItem && (
          <div className="mb-3 p-3 rounded flex flex-col gap-2" style={panelStyle}>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Name" value={itemForm.name} onChange={v => setItemForm(f => ({ ...f, name: v }))} />
              <Input label="Qty" value={String(itemForm.quantity)} onChange={v => setItemForm(f => ({ ...f, quantity: Number(v) || 1 }))} type="number" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Weight" value={itemForm.weight} onChange={v => setItemForm(f => ({ ...f, weight: v }))} placeholder="1 lb" />
              <Input label="Price" value={itemForm.price} onChange={v => setItemForm(f => ({ ...f, price: v }))} placeholder="2 marks" />
            </div>
            <Button variant="primary" size="sm" onClick={() => {
              if (!itemForm.name.trim()) return
              onAddEquipment(itemForm)
              setItemForm({ name: '', quantity: 1, weight: '', price: '' })
              setAddingItem(false)
            }}>Add Item</Button>
          </div>
        )}

        {character.equipment.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-fog)' }}>No items.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {character.equipment.map(item => (
              <div key={item.id} className="flex items-center justify-between px-2.5 py-1.5 rounded" style={panelStyle}>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--color-pale)' }}>
                    {item.quantity > 1 && <span style={{ color: 'var(--color-fog)' }}>{item.quantity}× </span>}
                    {item.name}
                  </span>
                  {item.weight && <span className="text-xs" style={{ color: 'var(--color-fog)' }}>{item.weight}</span>}
                  {item.price && <span className="text-xs" style={{ color: 'var(--color-fog)' }}>{item.price}</span>}
                </div>
                {!readOnly && (
                  <button type="button" onClick={() => onRemoveEquipment(item.id)} className="text-xs hover:opacity-70" style={{ color: 'var(--color-fog)' }}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
