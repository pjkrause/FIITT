class AddMediaToStakeholderMessages < ActiveRecord::Migration
  def change
    add_column :stakeholder_messages, :media, :string
  end
end
