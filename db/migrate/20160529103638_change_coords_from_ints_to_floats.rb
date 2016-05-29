class ChangeCoordsFromIntsToFloats < ActiveRecord::Migration
  def change
    change_table :games do |t|
      t.change :x_position, :float
      t.change :y_position, :float
    end

    change_table :decisions do |t|
      t.change :x_position, :float
      t.change :y_position, :float
    end

    change_table :steps do |t|
      t.change :x_position, :float
      t.change :y_position, :float
    end
  end
end
