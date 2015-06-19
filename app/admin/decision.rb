ActiveAdmin.register Decision do
  belongs_to :step
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
  permit_params :choice, :rt, :ec, :ic, :mp, :pp, :days, :next_step, :step_id
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if resource.something?
#   permitted
# end


end
