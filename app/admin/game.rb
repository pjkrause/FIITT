ActiveAdmin.register Game do

  permit_params :title, :description, :first_step

  form :partial => "form"
  
end
