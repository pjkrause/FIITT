class AddVideoToStakeholderMessages < ActiveRecord::Migration
  def change
    add_column :stakeholder_messages, :video, :string
  end
end
