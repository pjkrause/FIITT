class CreateStatuses < ActiveRecord::Migration
  def change
    create_table :statuses do |t|
      t.integer :crt, default: 0
      t.integer :external_communication, default: 0
      t.integer :internal_communication, default: 0
      t.integer :media_perception, default: 0
      t.integer :public_perception, default: 0
      t.integer :day_no, default: 0

      t.timestamps null: false
    end
  end
end
