class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :title
      t.text :description
      t.integer :first_step

      t.timestamps null: false
    end
  end
end
