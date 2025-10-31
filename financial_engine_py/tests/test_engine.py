from financial_engine import FinancialEngine, FinancialInputs


def test_engine_basic_capex():
    inputs = FinancialInputs(
        consumo_kwh_mensual=100000,
        demanda_kw=300,
        tarifa_cfe="OM",
        costo_energia_kwh=2.5,
        costo_demanda_kw=300,
        kWp=400.0,
        performance_ratio=0.82,
        degradacion_solar_anual=0.007,
        capex=12000000,
        opex_anual=250000,
        vida_proyecto_anos=20,
        tasa_descuento=0.10,
        inflacion_om=0.03,
        tasa_actualizacion_tarifa_anual=0.06,
        modo="CAPEX",
    )

    engine = FinancialEngine()
    out = engine.calculate(inputs)

    assert out.kpis.van is not None
    assert out.projections[0].energia_generada_kwh > 0
    assert len(out.cashflow) == inputs.vida_proyecto_anos + 1


def test_engine_ppa_mode():
    inputs = FinancialInputs(
        consumo_kwh_mensual=100000,
        demanda_kw=300,
        tarifa_cfe="OM",
        costo_energia_kwh=2.5,
        costo_demanda_kw=300,
        kWp=400.0,
        performance_ratio=0.82,
        degradacion_solar_anual=0.007,
        capex=None,
        opex_anual=150000,
        vida_proyecto_anos=20,
        tasa_descuento=0.10,
        inflacion_om=0.03,
        tasa_actualizacion_tarifa_anual=0.06,
        modo="PPA",
        costo_ppa_inicial=2.2,
        escalador_ppa_anual=0.02,
    )

    engine = FinancialEngine()
    out = engine.calculate(inputs)

    assert out.kpis.van is not None
    assert out.projections[0].costo_con_sistema > 0
    assert out.cashflow[0].flujo == 0.0  # año 0 sin inversión


