import React, { useState } from 'react';
import { Individual } from '../api/models/Individual';
import { updateIndividual, deleteIndividual } from '../api/IndividualService';

type Props = {
  individual: Individual;
  onUpdated?: () => void;
  onDeleted?: () => void;
};

export const IndividualEditor: React.FC<Props> = ({ individual, onUpdated, onDeleted }) => {
  const [form, setForm] = useState<Individual>(individual);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value } as Individual);
  };

  const handleUpdate = async () => {
    try {
      await updateIndividual(form.species_cd, form.id, form);
      setError(null);
      if (onUpdated) onUpdated();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIndividual(form.species_cd, form.id);
      setError(null);
      if (onDeleted) onDeleted();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h3>個体情報編集</h3>
      <div>
        <label>
          種別CD:
          <input name="species_cd" value={form.species_cd} onChange={handleChange} disabled />
        </label>
      </div>
      <div>
        <label>
          ID:
          <input name="id" value={form.id} onChange={handleChange} disabled />
        </label>
      </div>
      <div>
        <label>
          モルフ:
          <input name="morph" value={form.morph ?? ''} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          雌雄区分:
          <input name="gender_category" value={form.gender_category ?? ''} onChange={handleChange} />
        </label>
      </div>
      <button onClick={handleUpdate}>更新</button>
      <button onClick={handleDelete} style={{ marginLeft: '8px', color: 'red' }}>削除</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};