class ReportPdf < Prawn::Document

  def initialize(status)
    super(top_margin: 80)
    @status = status
    report_title
    move_down 20
    report_author_date
    move_down 10
    t = make_table(indicator_data, header: :true, :column_widths => [200, 100]) do
      row(0).font_style = :bold
      column(1).align = :center
    end
    t.draw
  end

  def report_title
    text "SIMULATION REPORT: #{Game.find(@status.game_id).title}", size: 15, style: :bold, align: :center
  end

  def report_author_date
    text "For Player: #{Player.find(@status.player_id).email}. Simulation completed at #{@status.updated_at}"
  end

  def indicator_data
    [
      ["Indicator", "Grade"],
      ["Total simulated days",    @status.day_no],
      ["External Communication",  @status.external_communication],
      ["Internal Communication",  @status.internal_communication],
      ["Media Perception",        @status.media_perception],
      ["Public Perception",       @status.public_perception]
    ]
  end

end