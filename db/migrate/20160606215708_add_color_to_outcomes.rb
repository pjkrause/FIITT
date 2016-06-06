class AddColorToOutcomes < ActiveRecord::Migration
  def change
    add_column :outcomes, :colour, :string, default: "#000000"
  end
end
