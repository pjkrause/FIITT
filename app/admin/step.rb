ActiveAdmin.register Step do

# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
  permit_params :general_message, :decision_table, :status_message, :default_step, :guidance, :game_id
  sidebar "Step Details", only: [:show, :edit] do
    ul do
      li link_to("Stakeholder Messages", admin_step_stakeholder_messages_path(step))
    end
  end

#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if resource.something?
#   permitted
# end


end
