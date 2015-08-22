class ReportPdf < Prawn::Document
  def initialize(status)
    super(top_margin: 80)
    @status = status
    report_title
    report_summary
  end

  def report_title
    text "Report for #{Player.find(@status.player_id).email}", size: 15, style: :bold
  end

  def report_summary
    move_down 20
    text "Summary of your run", style: :bold
    text "You completed the scenario in #{@status.day_no} days"
    text "External Communication: #{@status.external_communication}"
    text "Internal Communication: #{@status.internal_communication}"
    text "Media Perception: #{@status.media_perception}" 
    text "Public Perception: #{@status.public_perception}"
  end

end