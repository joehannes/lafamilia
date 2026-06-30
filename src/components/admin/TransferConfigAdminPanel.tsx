import React, { useEffect, useState } from 'react';
import { getTransferConfig, updateModifiers } from '../../services/transferConfigService';
import type { TransferConfig } from '../../types/transport';

const formatNumber = (value: number | undefined | null) =>
  value === undefined || value === null ? '' : String(value);

const TransferConfigAdminPanel: React.FC = () => {
  const [config, setConfig] = useState<TransferConfig | null>(null);
  const [draftModifiers, setDraftModifiers] = useState<TransferConfig['modifiers'] | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const transferConfig = await getTransferConfig();
      setConfig(transferConfig);
      setDraftModifiers({ ...transferConfig.modifiers });
    };

    load();
  }, []);

  const updateField = (field: keyof TransferConfig['modifiers'], value: string) => {
    if (!draftModifiers) return;
    setDraftModifiers({
      ...draftModifiers,
      [field]: Number(value),
    });
  };

  const handleSave = async () => {
    if (!config || !draftModifiers) return;
    setSaving(true);
    setMessage('');
    try {
      const updatedConfig = await updateModifiers(config, draftModifiers);
      setConfig(updatedConfig);
      setDraftModifiers({ ...updatedConfig.modifiers });
      setMessage('Saved transfer pricing settings.');
    } catch (error) {
      console.error(error);
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!draftModifiers) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <p className="text-slate-600">Loading transfer pricing settings…</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Transfer Pricing Settings</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Control how distance prices are calculated and how discounts settle over longer routes.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Defaults are tuned for ~180 km to be around USD 170 and ~400 km to be around USD 380 at USD 1.30/km.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Base price per km</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={formatNumber(draftModifiers.pricePerKm)}
            onChange={(event) => updateField('pricePerKm', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Minimum distance price</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={formatNumber(draftModifiers.minimumPrice)}
            onChange={(event) => updateField('minimumPrice', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Max distance discount (%)</span>
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={formatNumber(draftModifiers.distanceDiscountMaxPercent)}
            onChange={(event) => updateField('distanceDiscountMaxPercent', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Discount saturation distance (km)</span>
          <input
            type="number"
            min={1}
            step={1}
            value={formatNumber(draftModifiers.distanceDiscountSaturationKm)}
            onChange={(event) => updateField('distanceDiscountSaturationKm', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Round-trip discount multiplier</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={formatNumber(draftModifiers.roundTripDiscount)}
            onChange={(event) => updateField('roundTripDiscount', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Night transfer multiplier</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={formatNumber(draftModifiers.nightFeeMultiplier)}
            onChange={(event) => updateField('nightFeeMultiplier', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Waiting per hour</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={formatNumber(draftModifiers.waitingPerHour)}
            onChange={(event) => updateField('waitingPerHour', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Child seat fee</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={formatNumber(draftModifiers.childSeat)}
            onChange={(event) => updateField('childSeat', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Price markup multiplier</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={formatNumber(draftModifiers.priceMarkup)}
            onChange={(event) => updateField('priceMarkup', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
      </div>

      {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
    </div>
  );
};

export default TransferConfigAdminPanel;
