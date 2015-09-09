ActiveAdmin.register StakeholderMessage do
  belongs_to :step
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
  permit_params :step_id, :source, :message, :media, :video

  form :html => { :enctype => "multipart/form-data" } do |f|
    f.inputs "StakeholderMessage", :multipart => true do
      f.input :step_id
      f.input :source
      f.input :message
      f.input :media
      f.input :video
    end
    f.actions
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
