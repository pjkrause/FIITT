class RemoveColumnsFromDecisions < ActiveRecord::Migration
  def change
    remove_column :decisions, :next_step
    remove_column :decisions, :step_id
  end
end
