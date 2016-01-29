class AddDecisionTableToSteps < ActiveRecord::Migration
  def change
    add_column :steps, :decision_table, :hstore, default: {}, null: false
  end
end
