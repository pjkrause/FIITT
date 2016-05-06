class StatusChangeTraceType < ActiveRecord::Migration
  def change
    remove_column(:statuses, :trace)
    add_column(:statuses, :trace, :hstore, default: {}, null: false)
  end
end
