class CreateOutcomes < ActiveRecord::Migration
  def change
    create_table :outcomes do |t|
      t.integer :step_id
      t.integer :decision_ids, array:true, default: []
      t.integer :outcome_step_id

      t.timestamps null: false
    end
  end
end
