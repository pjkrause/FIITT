class CreateDecisions < ActiveRecord::Migration
  def change
    create_table :decisions do |t|
      t.text :choice
      t.integer :rt
      t.integer :ec
      t.integer :ic
      t.integer :mp
      t.integer :pp
      t.integer :days
      t.integer :next_step
      t.integer :step_id

      t.timestamps null: false
    end
  end
end
