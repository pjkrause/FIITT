require 'test_helper'

class StakeholderMessagesControllerTest < ActionController::TestCase
  setup do
    @stakeholder_message = stakeholder_messages(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:stakeholder_messages)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create stakeholder_message" do
    assert_difference('StakeholderMessage.count') do
      post :create, stakeholder_message: { message: @stakeholder_message.message, source: @stakeholder_message.source, step_id: @stakeholder_message.step_id }
    end

    assert_redirected_to stakeholder_message_path(assigns(:stakeholder_message))
  end

  test "should show stakeholder_message" do
    get :show, id: @stakeholder_message
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @stakeholder_message
    assert_response :success
  end

  test "should update stakeholder_message" do
    patch :update, id: @stakeholder_message, stakeholder_message: { message: @stakeholder_message.message, source: @stakeholder_message.source, step_id: @stakeholder_message.step_id }
    assert_redirected_to stakeholder_message_path(assigns(:stakeholder_message))
  end

  test "should destroy stakeholder_message" do
    assert_difference('StakeholderMessage.count', -1) do
      delete :destroy, id: @stakeholder_message
    end

    assert_redirected_to stakeholder_messages_path
  end
end
