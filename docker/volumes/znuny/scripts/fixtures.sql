BEGIN;

-- =====================================================================
-- 1) USERS (AGENTS)
-- =====================================================================

-- agent1
INSERT INTO public.users (login, pw, title, first_name, last_name, valid_id,
                          create_time, create_by, change_time, change_by)
SELECT
    'agent1',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',          -- à adapter si tu utilises un hash
    'M.',
    'Jean',
    'Agent',
    (SELECT id FROM public.valid ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE login = 'agent1'
);

-- agent2
INSERT INTO public.users (login, pw, title, first_name, last_name, valid_id,
                          create_time, create_by, change_time, change_by)
SELECT
    'agent2',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',          -- à adapter si tu utilises un hash
    'Mme',
    'Marie',
    'Agent',
    (SELECT id FROM public.valid ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE login = 'agent2'
);

-- =====================================================================
-- 2) FILES (QUEUES)
-- =====================================================================

-- File 1
INSERT INTO public.queue (
    name,
    group_id,
    unlock_timeout,
    first_response_time,
    first_response_notify,
    update_time,
    update_notify,
    solution_time,
    solution_notify,
    system_address_id,
    calendar_name,
    default_sign_key,
    salutation_id,
    signature_id,
    follow_up_id,
    follow_up_lock,
    comments,
    valid_id,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    'Test::File1',
    (SELECT id FROM public.groups ORDER BY id LIMIT 1),
    0,
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    (SELECT id FROM public.system_address ORDER BY id LIMIT 1),
    NULL,
    NULL,
    (SELECT id FROM public.salutation ORDER BY id LIMIT 1),
    (SELECT id FROM public.signature ORDER BY id LIMIT 1),
    (SELECT id FROM public.follow_up_possible ORDER BY id LIMIT 1),
    0,
    'File de test 1',
    (SELECT id FROM public.valid ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.queue WHERE name = 'Test::File1'
);

-- File 2
INSERT INTO public.queue (
    name,
    group_id,
    unlock_timeout,
    first_response_time,
    first_response_notify,
    update_time,
    update_notify,
    solution_time,
    solution_notify,
    system_address_id,
    calendar_name,
    default_sign_key,
    salutation_id,
    signature_id,
    follow_up_id,
    follow_up_lock,
    comments,
    valid_id,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    'Test::File2',
    (SELECT id FROM public.groups ORDER BY id LIMIT 1),
    0,
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    (SELECT id FROM public.system_address ORDER BY id LIMIT 1),
    NULL,
    NULL,
    (SELECT id FROM public.salutation ORDER BY id LIMIT 1),
    (SELECT id FROM public.signature ORDER BY id LIMIT 1),
    (SELECT id FROM public.follow_up_possible ORDER BY id LIMIT 1),
    0,
    'File de test 2',
    (SELECT id FROM public.valid ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.queue WHERE name = 'Test::File2'
);

-- =====================================================================
-- 3) TICKETS (4 tickets : 2 per file, distributed between the 2 agents)
-- =====================================================================

-- Ticket 1 - Test::File1 / agent1
INSERT INTO public.ticket (
    tn,
    title,
    queue_id,
    ticket_lock_id,
    type_id,
    service_id,
    sla_id,
    user_id,
    responsible_user_id,
    ticket_priority_id,
    ticket_state_id,
    customer_id,
    customer_user_id,
    timeout,
    until_time,
    escalation_time,
    escalation_update_time,
    escalation_response_time,
    escalation_solution_time,
    archive_flag,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    'T2025001',
    'Problème de connexion',
    (SELECT id FROM public.queue WHERE name = 'Test::File1'),
    (SELECT id FROM public.ticket_lock_type ORDER BY id LIMIT 1),
    (SELECT id FROM public.ticket_type ORDER BY id LIMIT 1),
    NULL,
    NULL,
    (SELECT id FROM public.users WHERE login = 'agent1'),
    (SELECT id FROM public.users WHERE login = 'agent1'),
    (SELECT id FROM public.ticket_priority ORDER BY id LIMIT 1),
    (SELECT id FROM public.ticket_state ORDER BY id LIMIT 1),
    'client1',
    'client1@example.com',
    0, 0, 0, 0, 0, 0,
    0,
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.ticket WHERE tn = 'T2025001'
);

-- Ticket 2 - Test::File1 / agent2
INSERT INTO public.ticket (
    tn,
    title,
    queue_id,
    ticket_lock_id,
    type_id,
    service_id,
    sla_id,
    user_id,
    responsible_user_id,
    ticket_priority_id,
    ticket_state_id,
    customer_id,
    customer_user_id,
    timeout,
    until_time,
    escalation_time,
    escalation_update_time,
    escalation_response_time,
    escalation_solution_time,
    archive_flag,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    'T2025002',
    'Erreur 500 sur la page d’accueil',
    (SELECT id FROM public.queue WHERE name = 'Test::File1'),
    (SELECT id FROM public.ticket_lock_type ORDER BY id LIMIT 1),
    (SELECT id FROM public.ticket_type ORDER BY id LIMIT 1),
    NULL,
    NULL,
    (SELECT id FROM public.users WHERE login = 'agent2'),
    (SELECT id FROM public.users WHERE login = 'agent2'),
    (SELECT id FROM public.ticket_priority ORDER BY id LIMIT 1),
    (SELECT id FROM public.ticket_state ORDER BY id LIMIT 1),
    'client2',
    'client2@example.com',
    0, 0, 0, 0, 0, 0,
    0,
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.ticket WHERE tn = 'T2025002'
);

-- Ticket 3 - Test::File2 / agent1
INSERT INTO public.ticket (
    tn,
    title,
    queue_id,
    ticket_lock_id,
    type_id,
    service_id,
    sla_id,
    user_id,
    responsible_user_id,
    ticket_priority_id,
    ticket_state_id,
    customer_id,
    customer_user_id,
    timeout,
    until_time,
    escalation_time,
    escalation_update_time,
    escalation_response_time,
    escalation_solution_time,
    archive_flag,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    'T2025003',
    'Question sur la facture',
    (SELECT id FROM public.queue WHERE name = 'Test::File2'),
    (SELECT id FROM public.ticket_lock_type ORDER BY id LIMIT 1),
    (SELECT id FROM public.ticket_type ORDER BY id LIMIT 1),
    NULL,
    NULL,
    (SELECT id FROM public.users WHERE login = 'agent1'),
    (SELECT id FROM public.users WHERE login = 'agent1'),
    (SELECT id FROM public.ticket_priority ORDER BY id LIMIT 1),
    (SELECT id FROM public.ticket_state ORDER BY id LIMIT 1),
    'client3',
    'client3@example.com',
    0, 0, 0, 0, 0, 0,
    0,
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.ticket WHERE tn = 'T2025003'
);

-- Ticket 4 - Test::File2 / agent2
INSERT INTO public.ticket (
    tn,
    title,
    queue_id,
    ticket_lock_id,
    type_id,
    service_id,
    sla_id,
    user_id,
    responsible_user_id,
    ticket_priority_id,
    ticket_state_id,
    customer_id,
    customer_user_id,
    timeout,
    until_time,
    escalation_time,
    escalation_update_time,
    escalation_response_time,
    escalation_solution_time,
    archive_flag,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    'T2025004',
    'Demande d’information générale',
    (SELECT id FROM public.queue WHERE name = 'Test::File2'),
    (SELECT id FROM public.ticket_lock_type ORDER BY id LIMIT 1),
    (SELECT id FROM public.ticket_type ORDER BY id LIMIT 1),
    NULL,
    NULL,
    (SELECT id FROM public.users WHERE login = 'agent2'),
    (SELECT id FROM public.users WHERE login = 'agent2'),
    (SELECT id FROM public.ticket_priority ORDER BY id LIMIT 1),
    (SELECT id FROM public.ticket_state ORDER BY id LIMIT 1),
    'client4',
    'client4@example.com',
    0, 0, 0, 0, 0, 0,
    0,
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.ticket WHERE tn = 'T2025004'
);

-- =====================================================================
-- 4) ARTICLES + MIME CONTENT (1 article per ticket)
-- =====================================================================

WITH t AS (
    SELECT id, tn
    FROM public.ticket
    WHERE tn IN ('T2025001','T2025002','T2025003','T2025004')
),
ins_article AS (
    INSERT INTO public.article (
        ticket_id,
        article_sender_type_id,
        communication_channel_id,
        is_visible_for_customer,
        search_index_needs_rebuild,
        insert_fingerprint,
        create_time,
        create_by,
        change_time,
        change_by
    )
    SELECT
        t.id,
        (SELECT id FROM public.article_sender_type ORDER BY id LIMIT 1),
        (SELECT id FROM public.communication_channel ORDER BY id LIMIT 1),
        1,
        1,
        NULL,
        NOW(),
        (SELECT id FROM public.users ORDER BY id LIMIT 1),
        NOW(),
        (SELECT id FROM public.users ORDER BY id LIMIT 1)
    FROM t
    -- on ne recrée pas si un article existe déjà pour ce ticket
    WHERE NOT EXISTS (
        SELECT 1 FROM public.article a WHERE a.ticket_id = t.id
    )
    RETURNING id, ticket_id
)
INSERT INTO public.article_data_mime (
    article_id,
    a_from,
    a_reply_to,
    a_to,
    a_cc,
    a_bcc,
    a_subject,
    a_message_id,
    a_message_id_md5,
    a_in_reply_to,
    a_references,
    a_content_type,
    a_body,
    incoming_time,
    content_path,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    a.id,
    'client@example.com',
    NULL,
    'support@example.com',
    NULL,
    NULL,
    CASE t.tn
        WHEN 'T2025001' THEN 'Problème de connexion'
        WHEN 'T2025002' THEN 'Erreur 500 sur la page'
        WHEN 'T2025003' THEN 'Question sur la facture'
        ELSE 'Demande d''information'
    END,
    t.tn || '@example.com',
    NULL,
    NULL,
    NULL,
    'text/plain; charset=UTF-8',
    CASE t.tn
        WHEN 'T2025001' THEN 'Je ne parviens plus à me connecter à la plateforme.'
        WHEN 'T2025002' THEN 'Une erreur 500 apparaît régulièrement sur la page d’accueil.'
        WHEN 'T2025003' THEN 'Pouvez-vous m’envoyer le détail de ma facture ?'
        ELSE 'J’aimerais avoir quelques informations complémentaires.'
    END,
    EXTRACT(EPOCH FROM NOW())::int,
    NULL,
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
FROM ins_article a
JOIN public.ticket t ON t.id = a.ticket_id;

-- =====================================================================
-- 5) DYNAMIC FIELDS = PERSONNALIZED "TAGS" FIELDS
-- =====================================================================

-- Tag principal
INSERT INTO public.dynamic_field (
    internal_field,
    name,
    label,
    field_order,
    field_type,
    object_type,
    config,
    valid_id,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    0,
    'Tag_Main',
    'Tag principal',
    100,
    'Text',
    'Ticket',
    '{}',
    (SELECT id FROM public.valid ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.dynamic_field WHERE name = 'Tag_Main'
);

-- Client type
INSERT INTO public.dynamic_field (
    internal_field,
    name,
    label,
    field_order,
    field_type,
    object_type,
    config,
    valid_id,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    0,
    'Tag_ClientType',
    'Type de client',
    110,
    'Text',
    'Ticket',
    '{}',
    (SELECT id FROM public.valid ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.dynamic_field WHERE name = 'Tag_ClientType'
);

-- Impact
INSERT INTO public.dynamic_field (
    internal_field,
    name,
    label,
    field_order,
    field_type,
    object_type,
    config,
    valid_id,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    0,
    'Tag_Impact',
    'Impact',
    120,
    'Text',
    'Ticket',
    '{}',
    (SELECT id FROM public.valid ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1),
    NOW(),
    (SELECT id FROM public.users ORDER BY id LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.dynamic_field WHERE name = 'Tag_Impact'
);

-- =====================================================================
-- 6) TAG VALUES ON TICKETS
-- =====================================================================

-- Tag_Main on T2025001/T2025002
INSERT INTO public.dynamic_field_value (field_id, object_id, value_text, value_date, value_int)
SELECT
    df.id,
    t.id,
    'bug',
    NULL,
    NULL
FROM public.dynamic_field df
JOIN public.ticket t ON t.tn = 'T2025001'
WHERE df.name = 'Tag_Main'
  AND NOT EXISTS (
      SELECT 1 FROM public.dynamic_field_value v
      WHERE v.field_id = df.id AND v.object_id = t.id
  );

INSERT INTO public.dynamic_field_value (field_id, object_id, value_text, value_date, value_int)
SELECT
    df.id,
    t.id,
    'incident',
    NULL,
    NULL
FROM public.dynamic_field df
JOIN public.ticket t ON t.tn = 'T2025002'
WHERE df.name = 'Tag_Main'
  AND NOT EXISTS (
      SELECT 1 FROM public.dynamic_field_value v
      WHERE v.field_id = df.id AND v.object_id = t.id
  );

-- Tag_ClientType
INSERT INTO public.dynamic_field_value (field_id, object_id, value_text, value_date, value_int)
SELECT
    df.id,
    t.id,
    'VIP',
    NULL,
    NULL
FROM public.dynamic_field df
JOIN public.ticket t ON t.tn IN ('T2025001','T2025003')
WHERE df.name = 'Tag_ClientType'
  AND NOT EXISTS (
      SELECT 1 FROM public.dynamic_field_value v
      WHERE v.field_id = df.id AND v.object_id = t.id
  );

-- Tag_Impact
INSERT INTO public.dynamic_field_value (field_id, object_id, value_text, value_date, value_int)
SELECT
    df.id,
    t.id,
    'fort',
    NULL,
    NULL
FROM public.dynamic_field df
JOIN public.ticket t ON t.tn = 'T2025002'
WHERE df.name = 'Tag_Impact'
  AND NOT EXISTS (
      SELECT 1 FROM public.dynamic_field_value v
      WHERE v.field_id = df.id AND v.object_id = t.id
  );

INSERT INTO public.dynamic_field_value (field_id, object_id, value_text, value_date, value_int)
SELECT
    df.id,
    t.id,
    'faible',
    NULL,
    NULL
FROM public.dynamic_field df
JOIN public.ticket t ON t.tn = 'T2025004'
WHERE df.name = 'Tag_Impact'
  AND NOT EXISTS (
      SELECT 1 FROM public.dynamic_field_value v
      WHERE v.field_id = df.id AND v.object_id = t.id
  );

COMMIT;

BEGIN;

-- Give all rights on all groups to agent1 and agent2
INSERT INTO public.group_user (
    user_id,
    group_id,
    permission_key,
    create_time,
    create_by,
    change_time,
    change_by
)
SELECT
    u.id         AS user_id,
    g.id         AS group_id,
    p.permission AS permission_key,
    NOW(),
    u.id,
    NOW(),
    u.id
FROM public.users u
JOIN public.groups g ON 1=1
JOIN (VALUES ('ro'), ('move_into'), ('create'), ('owner'), ('priority'), ('rw')) AS p(permission)
    ON 1=1
WHERE u.login IN ('agent1', 'agent2')
  AND NOT EXISTS (
      SELECT 1
      FROM public.group_user gu
      WHERE gu.user_id = u.id
        AND gu.group_id = g.id
        AND gu.permission_key = p.permission
  );

COMMIT;
