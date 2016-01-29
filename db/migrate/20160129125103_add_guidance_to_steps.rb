class AddGuidanceToSteps < ActiveRecord::Migration
  def change
    add_column :steps, :guidance, :text
  end
end
