from financial_engine import FinancialEngine, FinancialInputs


def main() -> None:
    inputs = FinancialInputs(
        consumo_kwh_mensual=120000,
        demanda_kw=450,
        tarifa_cfe="OM",
        costo_total_actual=1050000,
        costo_energia_kwh=2.85,
        costo_demanda_kw=325,
        dias_facturados=30,
        periodo_facturacion="2024-09",
        tasa_actualizacion_tarifa_anual=0.075,
        degradacion_solar_anual=0.007,
        kWp=500.0,
        performance_ratio=0.82,
        capex=18000000,
        opex_anual=350000,
        vida_proyecto_anos=25,
        modo="CAPEX",
        tasa_descuento=0.10,
        inflacion_om=0.03,
    )

    engine = FinancialEngine()
    result = engine.calculate(inputs)

    print("VAN:", result.kpis.van)
    print("TIR:", result.kpis.tir)
    print("Payback:", result.kpis.payback_simple)
    print("LCOE:", result.kpis.lcoe)


if __name__ == "__main__":
    main()


