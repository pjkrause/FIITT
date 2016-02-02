class AddDefaultStepToSteps < ActiveRecord::Migration
  def change
    add_column :steps, :default_step, :integer
  end
end
