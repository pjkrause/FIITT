class AddTraceToStatus < ActiveRecord::Migration
  def change
    add_column :statuses, :trace, :integer, :array => true, :default => '{}'
  end
end
