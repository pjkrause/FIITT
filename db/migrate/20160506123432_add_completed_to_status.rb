class AddCompletedToStatus < ActiveRecord::Migration
  def change
    add_column :statuses, :completed, :boolean, default: false
  end
end
