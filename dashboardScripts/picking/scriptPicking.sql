SELECT 
    -- Datos de la Operación
    op.ID as ID_OPERACION,
    op.FECHAH_CREACION as FECHA_CREACION_OPERACION,
    op.FECHAH_INICIO as FECHA_INICIO_OPERACION,
    op.FECHAH_FIN as FECHA_FIN_OPERACION,
    op.NOMBRE_USUARIO as USUARIO_OPERACION,
    op.ID_MOVIL as TERMINAL,
    op.FECHAH_ES_ASIGNABLE as FECHA_DESBLOQUEO,
    op.FECHAH_CARGA_CONTENEDOR as FECHA_PRIMERA_CARGA,
    --op.ESTADO as ESTADO,
    
    -- Datos del Traspaso
    t.ID_PEDIDO,
    t.ID_ARTICULO,
    t.CANT_A_TRASPASAR,
    t.CANT_TRASPASADA,
    t.ETIQUETA_BULTO,
    t.ID_UBIC_ORIGEN as UBICACION_ORIGEN,
    t.ID_CENTRO as ID_TIENDA_DESTINO,
    t.NUM_SECUENCIA,
    t.FECHA_REALIZADO as FECHA_TRASPASO,
    t.CLASE_STOCK,
    t.NOMBRE_USUARIO as USUARIO_TRASPASO,
    t.ID_SECCION,
    t.ES_REPESCA,
    CASE WHEN t.ES_REPESCA = 1 THEN 'SI' ELSE 'NO' END as ES_REPESCA_TEXTO,
    
    -- Datos del Pedido
    p.ID_LOCAL as ID_TIENDA_PEDIDO,
    p.CODIGO_PEDIDO,
    p.FECHAH_GENERACION as FECHA_GENERACION_PEDIDO,
    p.FECHA_FIN_PREPARACION,
    
    -- Datos del Centro/Tienda
    c.NOMBRE as NOMBRE_TIENDA,
    
    -- Datos del Artículo
    a.CODE_ERP as SKU,
    a.DESCRIPCION as DESCRIPCION_ARTICULO,
    
    -- ============================================
    -- MÉTRICAS DE TIEMPO DE OPERACIÓN
    -- ============================================
    DATEDIFF(MINUTE, op.FECHAH_INICIO, op.FECHAH_FIN) as DURACION_OPERACION_MINUTOS,
    DATEDIFF(SECOND, op.FECHAH_INICIO, op.FECHAH_FIN) as DURACION_OPERACION_SEGUNDOS,
    DATEDIFF(MINUTE, op.FECHAH_CREACION, op.FECHAH_INICIO) as TIEMPO_ESPERA_INICIO_MINUTOS,
    
    -- Tiempo desde inicio de operación hasta este traspaso
    DATEDIFF(MINUTE, op.FECHAH_INICIO, t.FECHA_REALIZADO) as MINUTOS_DESDE_INICIO_OP,
    DATEDIFF(SECOND, op.FECHAH_INICIO, t.FECHA_REALIZADO) as SEGUNDOS_DESDE_INICIO_OP,
    
    -- ============================================
    -- DIFERENCIA ENTRE TRASPASOS DE LA MISMA OPERACIÓN
    -- ============================================
    -- Tiempo desde el traspaso anterior (en la misma operación)
    DATEDIFF(MINUTE, 
        LAG(t.FECHA_REALIZADO) OVER (PARTITION BY op.ID ORDER BY t.NUM_SECUENCIA, t.FECHA_REALIZADO),
        t.FECHA_REALIZADO
    ) as MINUTOS_DESDE_TRASPASO_ANTERIOR,
    
    DATEDIFF(SECOND, 
        LAG(t.FECHA_REALIZADO) OVER (PARTITION BY op.ID ORDER BY t.NUM_SECUENCIA, t.FECHA_REALIZADO),
        t.FECHA_REALIZADO
    ) as SEGUNDOS_DESDE_TRASPASO_ANTERIOR,
    
    -- Fecha del traspaso anterior (para referencia)
    LAG(t.FECHA_REALIZADO) OVER (PARTITION BY op.ID ORDER BY t.NUM_SECUENCIA, t.FECHA_REALIZADO) as FECHA_TRASPASO_ANTERIOR,
    
    -- Número de secuencia del traspaso anterior
    LAG(t.NUM_SECUENCIA) OVER (PARTITION BY op.ID ORDER BY t.NUM_SECUENCIA, t.FECHA_REALIZADO) as NUM_SECUENCIA_ANTERIOR,
    
    -- Tiempo hasta el siguiente traspaso (útil para análisis)
    DATEDIFF(MINUTE,
        t.FECHA_REALIZADO,
        LEAD(t.FECHA_REALIZADO) OVER (PARTITION BY op.ID ORDER BY t.NUM_SECUENCIA, t.FECHA_REALIZADO)
    ) as MINUTOS_HASTA_SIGUIENTE_TRASPASO,
    
    -- ============================================
    -- INDICADORES ADICIONALES
    -- ============================================
    -- Posición del traspaso dentro de la operación
    ROW_NUMBER() OVER (PARTITION BY op.ID ORDER BY t.NUM_SECUENCIA, t.FECHA_REALIZADO) as POSICION_TRASPASO,
    
    -- Total de traspasos en la operación
    COUNT(*) OVER (PARTITION BY op.ID) as TOTAL_TRASPASOS_OPERACION,
    
    -- Es el primer traspaso de la operación
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY op.ID ORDER BY t.NUM_SECUENCIA, t.FECHA_REALIZADO) = 1 
        THEN 'SI' 
        ELSE 'NO' 
    END as ES_PRIMER_TRASPASO,
    
    -- Es el último traspaso de la operación
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY op.ID ORDER BY t.NUM_SECUENCIA, t.FECHA_REALIZADO) = 
             COUNT(*) OVER (PARTITION BY op.ID)
        THEN 'SI' 
        ELSE 'NO' 
    END as ES_ULTIMO_TRASPASO,
    
    -- ============================================
    -- MÉTRICAS EXISTENTES
    -- ============================================
    CASE 
        WHEN t.CANT_A_TRASPASAR > 0 
        THEN CAST(t.CANT_TRASPASADA AS FLOAT) / t.CANT_A_TRASPASAR * 100 
        ELSE 0 
    END as PORCENTAJE_COMPLETADO,
    
    CAST(op.FECHAH_CREACION AS DATE) as FECHA_OPERACION,
    DATEPART(YEAR, op.FECHAH_CREACION) as AÑO,
    DATEPART(MONTH, op.FECHAH_CREACION) as MES,
    DATEPART(WEEK, op.FECHAH_CREACION) as SEMANA,
    DATEPART(HOUR, t.FECHA_REALIZADO) as HORA_TRASPASO,
    DATENAME(WEEKDAY, op.FECHAH_CREACION) as DIA_SEMANA

FROM OPERACIONES_RF op
    INNER JOIN TRASPASOS t ON op.ID = t.ID_RECORRIDO
    LEFT JOIN PEDIDOS p ON t.ID_PEDIDO = p.ID
    LEFT JOIN CENTROS c ON t.ID_CENTRO = c.ID
    LEFT JOIN ARTICULOS a ON t.ID_ARTICULO = a.ID

WHERE op.TIPO_INTERNO = 5 and OP.ESTADO = 2 and op.FECHAH_INICIO > '2025/10/01 00:00:00'-- Solo operaciones de PICKING

ORDER BY op.FECHAH_CREACION DESC, op.id, t.NUM_SECUENCIA, t.FECHA_REALIZADO